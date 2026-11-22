import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Printer } from 'lucide-react';
import { legal } from '../content/legal/legal';
import { spaLink } from './spaLink';

interface Props {
  doc: 'agb' | 'avv';
  onBack: () => void;
}

const text = (node: React.ReactNode): string =>
  React.Children.toArray(node).map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : React.isValidElement(c) ? text((c.props as { children?: React.ReactNode }).children) : '')).join('');

/** Stabiler Anker je Überschrift: "§ 12 …" -> par-12, "Anlage 2: …" -> anlage-2, sonst Kleinschreibung mit Bindestrichen. */
export function headingId(label: string): string {
  const par = label.match(/^§\s*(\d+)/);
  if (par) return `par-${par[1]}`;
  const anl = label.match(/^Anlage\s*(\d+)/i);
  if (anl) return `anlage-${anl[1]}`;
  return label.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const components: Components = {
  h2: ({ children }) => {
    const id = headingId(text(children));
    return (
      <h2 id={id} className="group scroll-mt-8">
        {children}
        <a href={`#${id}`} aria-label="Link zu diesem Abschnitt" className="legal-anchor ml-2 no-underline opacity-0 group-hover:opacity-100 focus:opacity-100 text-dim">#</a>
      </h2>
    );
  },
  a: ({ href = '', children }) =>
    href.startsWith('/') ? <a {...spaLink(href)}>{children}</a> : <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>,
  // Breite Tabellen (AVV) scrollen am Handy seitlich, statt die Seite zu sprengen
  table: ({ children }) => (
    <div className="legal-table my-8 overflow-x-auto">
      <table className="min-w-[640px]">{children}</table>
    </div>
  ),
};

const LegalPage: React.FC<Props> = ({ doc, onBack }) => {
  const d = legal[doc];
  // Erste Zeile "# Titel" wird zur H1 der Seite, der Rest ist der Text
  const m = d.md.match(/^#\s+(.+)\n+([\s\S]*)$/);
  const h1 = m ? m[1] : d.title;
  const body = m ? m[2] : d.md;
  // Inhaltsverzeichnis aus den § / Anlage-Überschriften (Anker-Links für jeden Abschnitt)
  const toc = [...body.matchAll(/^##\s+(.+)$/gm)].map((x) => x[1].trim());
  return (
    <div className="legal-page min-h-screen bg-ink text-ftext font-body px-4 py-20">
      <div className="container mx-auto max-w-3xl">
        <a {...spaLink('/', onBack)} className="legal-noprint flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
        </a>

        <h1 className="font-syne font-extrabold uppercase text-[clamp(17px,5vw,30px)] md:text-4xl mb-4 break-words hyphens-auto">{h1}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-line">
          <p className="legal-stand font-mono text-[14px] text-muted">Version {d.version} · Stand {d.stand}</p>
          <button type="button" onClick={() => window.print()} className="legal-noprint inline-flex items-center gap-2 font-mono text-sm uppercase border border-line px-4 py-2.5 text-ftext hover:border-accent hover:text-accent transition-colors">
            <Printer className="w-4 h-4" aria-hidden="true" /> Als PDF speichern / drucken
          </button>
        </div>

        <nav aria-label="Inhalt" className="legal-noprint mb-12 border border-line p-5">
          <p className="font-mono text-[13px] uppercase text-dim mb-3">Inhalt</p>
          <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2 text-[15px] text-muted list-none p-0 m-0">
            {toc.map((t) => (
              <li key={t}><a href={`#${headingId(t)}`} className="hover:text-accent transition-colors">{t}</a></li>
            ))}
          </ul>
        </nav>

        <div className="legal-body prose prose-invert max-w-none
          prose-headings:font-syne prose-headings:tracking-[-0.01em] prose-headings:[text-wrap:balance]
          prose-h2:text-[24px] prose-h2:leading-tight prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
          prose-p:text-muted prose-p:leading-relaxed prose-p:font-body
          prose-li:text-muted prose-li:leading-relaxed
          prose-strong:text-ftext
          prose-a:text-accent prose-a:no-underline hover:prose-a:text-ftext
          prose-hr:border-line
          prose-table:text-sm prose-table:my-0
          prose-th:text-left prose-th:text-ftext prose-th:font-semibold prose-th:border-b prose-th:border-line prose-th:pb-2 prose-th:align-bottom
          prose-td:border-b prose-td:border-line prose-td:py-2.5 prose-td:text-muted prose-td:align-top
          [overflow-wrap:anywhere]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
