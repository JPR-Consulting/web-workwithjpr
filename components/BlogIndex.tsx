import React from 'react';
import { ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../content/blog';

interface Props {
  onNavigate: (view: string, slug?: string) => void;
}

const BlogIndex: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-[100dvh] bg-ink text-ftext font-body">
      <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <button
          onClick={() => onNavigate('HOME')}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12 font-mono text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </button>

        <div className="mb-16">
          <div className="font-mono text-[13px] text-accent uppercase mb-5">Blog</div>
          <h1 className="font-syne font-extrabold uppercase text-[clamp(34px,5vw,56px)] tracking-[-0.015em] leading-[1.02] mb-6">
            Wissen &amp; Einblicke
          </h1>
          <p className="text-muted text-lg max-w-[55ch]">
            Tipps zu Webdesign, SEO und digitaler Sichtbarkeit für lokale Unternehmen in Berlin.
          </p>
        </div>

        <div className="border-t border-line">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              onClick={() => onNavigate('BLOG_POST', post.slug)}
              className="group py-8 border-b border-line hover:bg-panel transition-colors cursor-pointer"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-accent uppercase">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="font-syne font-bold text-2xl mb-3 group-hover:text-accent transition-colors">
                {post.title}
              </h2>

              <p className="text-muted leading-relaxed mb-4 max-w-[60ch]">
                {post.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 font-mono text-[13px] text-dim uppercase">
                  <span>{new Date(post.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <span className="text-accent flex items-center gap-1 font-mono text-[13px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Lesen <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
