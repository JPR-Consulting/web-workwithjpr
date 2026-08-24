import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { BlogPost as BlogPostType } from '../content/blog';
import MagneticButton from './MagneticButton';

interface Props {
  post: BlogPostType;
  onNavigate: (view: string) => void;
  openCalendly: () => void;
}

const BlogPost: React.FC<Props> = ({ post, onNavigate, openCalendly }) => {
  useEffect(() => {
    document.title = `${post.title} | JPR Consulting`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.description);

    return () => {
      document.title = 'Webdesign Berlin — Moderne Websites für lokale Unternehmen | JPR Consulting';
    };
  }, [post]);

  return (
    <div className="min-h-[100dvh] bg-ink text-ftext font-body">
      <div className="px-6 md:px-12 py-20 max-w-3xl mx-auto">
        <button
          onClick={() => onNavigate('BLOG')}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12 font-mono text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Alle Artikel
        </button>

        <article>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-xs text-accent uppercase">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-syne font-extrabold uppercase text-[clamp(30px,4.5vw,52px)] tracking-[-0.015em] leading-[1.05] mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 font-mono text-[13px] text-dim uppercase mb-12 pb-8 border-b border-line">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-syne prose-headings:tracking-tight prose-headings:uppercase
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted prose-p:leading-relaxed prose-p:font-body
            prose-li:text-muted
            prose-strong:text-ftext
            prose-a:text-accent prose-a:no-underline hover:prose-a:text-ftext
            prose-table:text-sm
            prose-th:text-left prose-th:text-muted prose-th:font-medium prose-th:border-b prose-th:border-line prose-th:pb-2
            prose-td:border-b prose-td:border-line prose-td:py-2 prose-td:text-muted
          ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
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

          {/* CTA */}
          <div className="mt-16 p-9 border border-line bg-panel text-center">
            <h3 className="font-syne font-bold text-2xl tracking-tight mb-3">Bereit für deine neue Website?</h3>
            <p className="text-muted mb-6 max-w-md mx-auto">
              Kostenloser Entwurf — du siehst vorab, was du bekommst. Kein Risiko, keine Verpflichtung.
            </p>
            <MagneticButton
              as="button"
              onClick={openCalendly}
              className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-accent text-ink px-7 py-4 border border-accent hover:bg-transparent hover:text-accent transition-colors"
            >
              Kostenloser Entwurf anfragen →
            </MagneticButton>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
