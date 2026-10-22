import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { BlogPost as BlogPostType, blogPostTitle } from '../content/blog';
import { copy } from '../content/site-copy';
import MagneticButton from './MagneticButton';
import CheckDialog from './CheckDialog';
import { spaLink } from './spaLink';

/** Link-Ziel im Artikeltext, das den Entwurf-Dialog öffnet: [Text](#entwurf) */
const DRAFT_HREF = '#entwurf';
/** Link-Ziel im Artikeltext, das den Website-Check-Dialog öffnet: [Text](#pruefen) */
const CHECK_HREF = '#pruefen';

const buttonClass = 'not-prose inline-flex items-center gap-2 font-mono text-sm font-medium uppercase bg-accent text-ink px-6 py-3.5 border border-accent hover:bg-transparent hover:text-accent transition-colors';

/** Website-Feld + Knopf im Artikel; die Adresse geht in den Check-Dialog, dort folgt nur noch die E-Mail. */
const CheckInline: React.FC<{ onSubmit: (website: string) => void }> = ({ onSubmit }) => {
  const [website, setWebsite] = useState('');
  return (
    <form
      className="not-prose mt-6"
      onSubmit={(e) => { e.preventDefault(); onSubmit(website.trim()); }}
    >
      <label htmlFor="check-inline" className="block font-mono text-[13px] uppercase text-muted mb-2">Deine Website</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="check-inline"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="meinbetrieb.de"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="flex-1 min-w-0 h-14 px-4 bg-ink border border-line text-ftext text-[17px] font-body placeholder:text-dim focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <button type="submit" className={`${buttonClass} justify-center h-14 whitespace-nowrap`}>
          Website kostenlos prüfen lassen →
        </button>
      </div>
      <p className="mt-3 font-mono text-[12px] uppercase text-dim">Kostenlos · keine Verpflichtung · kein Verkaufsgespräch</p>
    </form>
  );
};

/** Bild im Artikel: ![Alt](/pfad.png "560x945") – der Titel trägt die Maße gegen Layout-Sprünge. */
const ArticleImage: React.FC<{ src?: string; alt?: string; title?: string }> = ({ src, alt = '', title }) => {
  const [w, h] = (title ?? '').split('x').map(Number);
  return (
    <img
      src={src}
      alt={alt}
      width={w || undefined}
      height={h || undefined}
      loading="lazy"
      decoding="async"
      className="block mx-auto w-full max-w-[560px] h-auto border border-line"
    />
  );
};

const formatDate = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  post: BlogPostType;
  onNavigate: (view: string) => void;
  onRequestDraft: () => void;
  openCalendly: () => void;
}

const BlogPost: React.FC<Props> = ({ post, onNavigate, onRequestDraft, openCalendly }) => {
  const [checkOpen, setCheckOpen] = useState(false);
  const [checkWebsite, setCheckWebsite] = useState('');
  const openCheck = (website = '') => { setCheckWebsite(website); setCheckOpen(true); };

  useEffect(() => {
    document.title = blogPostTitle(post);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.seoDescription ?? post.description);

    return () => {
      document.title = copy.de.meta.homeTitle;
    };
  }, [post]);

  const markdownComponents = useMemo<Components>(() => ({
    // Interne Links (/preise, /blog/…) wechseln die Ansicht ohne Neuladen;
    // #entwurf und #pruefen werden zu Knöpfen, die den jeweiligen Dialog öffnen.
    a: ({ href = '', children }) => {
      if (href === DRAFT_HREF || href === CHECK_HREF) {
        const open = href === DRAFT_HREF ? onRequestDraft : () => openCheck();
        return (
          <a href={href} onClick={(e) => { e.preventDefault(); open(); }} className={buttonClass}>
            {children} →
          </a>
        );
      }
      return href.startsWith('/') ? <a {...spaLink(href)}>{children}</a> : <a href={href}>{children}</a>;
    },
    // Ein Absatz, der nur aus [Text](#pruefen) besteht, wird zum Website-Feld mit Knopf
    p: ({ node, children }) => {
      const only = node?.children.length === 1 ? node.children[0] : null;
      if (only && only.type === 'element' && only.tagName === 'a' && only.properties?.href === CHECK_HREF) {
        return <CheckInline onSubmit={openCheck} />;
      }
      return <p>{children}</p>;
    },
    img: ({ src, alt, title }) => <ArticleImage src={src} alt={alt} title={title} />,
    // Zitatblock = Entwurf-Kasten im Text
    blockquote: ({ children }) => (
      <aside className="not-italic my-10 p-6 md:p-8 border border-accent/60 bg-panel [&_p]:my-0 [&_p+p]:mt-5 [&_p]:text-ftext">
        {children}
      </aside>
    ),
    // Breite Tabellen scrollen am Handy seitlich, statt die Seite zu sprengen
    table: ({ children }) => (
      <div className="my-8">
        <p className="not-prose md:hidden font-mono text-xs uppercase text-dim mb-2" aria-hidden="true">← Tabelle seitlich wischen →</p>
        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          <table className="min-w-[560px]">{children}</table>
        </div>
      </div>
    ),
  }), [onRequestDraft]);

  const updated = post.updated ?? null;

  return (
    <div className="min-h-[100dvh] bg-ink text-ftext font-body">
      <div className="px-6 md:px-12 py-20 max-w-3xl mx-auto">
        <a
          {...spaLink('/blog', () => onNavigate('BLOG'))}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12 font-mono text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Alle Artikel
        </a>

        <article>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-xs text-accent uppercase">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-syne font-bold text-[clamp(32px,4.4vw,48px)] tracking-[-0.02em] leading-[1.1] mb-5 [text-wrap:balance]">
            {post.title}
          </h1>

          <p className="text-muted text-lg leading-relaxed mb-8">{post.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] text-dim uppercase mb-12 pb-8 border-b border-line">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {updated ? <>Zuletzt aktualisiert: <time dateTime={updated}>{formatDate(updated)}</time></> : <time dateTime={post.date}>{formatDate(post.date)}</time>}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span>Von Jan Rojek</span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-syne prose-headings:tracking-[-0.01em] prose-headings:[text-wrap:balance]
            prose-h2:text-[28px] prose-h2:leading-tight prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-5
            prose-h3:font-body prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-2
            prose-p:text-muted prose-p:leading-relaxed prose-p:font-body
            prose-li:text-muted
            prose-strong:text-ftext
            prose-a:text-accent prose-a:no-underline hover:prose-a:text-ftext
            prose-table:text-sm prose-table:my-0
            prose-th:text-left prose-th:text-ftext prose-th:font-semibold prose-th:border-b prose-th:border-line prose-th:pb-2 prose-th:align-bottom
            prose-td:border-b prose-td:border-line prose-td:py-2.5 prose-td:text-muted prose-td:align-top
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{post.content}</ReactMarkdown>

            {post.faq && post.faq.length > 0 && (
              <>
                <h2>Häufige Fragen</h2>
                {post.faq.map((f) => (
                  <React.Fragment key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>

          {/* Author Bio */}
          <div className="mt-12 flex items-center gap-4 p-6 border border-line bg-panel">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 grayscale">
              <img src="/jan-rojek.webp" alt="Jan Rojek" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-ftext font-semibold">Jan Rojek</p>
              <p className="text-muted text-sm">Gründer & Webentwickler bei JPR Consulting GmbH. Über 7 Jahre Erfahrung in Webentwicklung, Performance Marketing und KI-Automatisierung.</p>
            </div>
          </div>

          {/* CTA: Entwurf ist der Hauptweg, das Gespräch die Alternative */}
          <div className="mt-16 p-9 border border-line bg-panel text-center">
            <h2 className="font-syne font-bold text-[28px] leading-tight tracking-[-0.01em] mb-3 [text-wrap:balance]">Was würde deine Website kosten?</h2>
            <p className="text-muted mb-7 max-w-md mx-auto">
              Trag deine aktuelle Website ein. In 48 Stunden bekommst du einen anklickbaren Entwurf deiner neuen Startseite und danach einen Festpreis. Kostenlos und ohne Verpflichtung.
            </p>
            <MagneticButton
              as="button"
              onClick={onRequestDraft}
              className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-accent text-ink px-7 py-4 border border-accent hover:bg-transparent hover:text-accent transition-colors"
            >
              Kostenlosen Entwurf anfordern →
            </MagneticButton>
            <p className="mt-5">
              <button type="button" onClick={openCalendly} className="text-[15px] text-muted hover:text-accent transition-colors underline underline-offset-4">
                Lieber erst sprechen? Termin buchen
              </button>
            </p>
          </div>
        </article>
      </div>
      <CheckDialog open={checkOpen} onClose={() => setCheckOpen(false)} topic={post.slug} initialWebsite={checkWebsite} />
    </div>
  );
};

export default BlogPost;
