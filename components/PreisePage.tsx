import React from 'react';
import { ArrowLeft, Layers, Palette, Plug, RefreshCw } from 'lucide-react';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import MagneticButton from './MagneticButton';
import { useCopy, useLang, LangSwitch } from '../i18n';
import { paths, type Lang } from '../content/site-copy';
import { spaLink } from './spaLink';

interface Props {
  onNavigate: (view: string, slug?: string) => void;
  onRequestDraft: () => void;
  onLangChange: (lang: Lang) => void;
}

const factorIcons = [Layers, Palette, Plug, RefreshCw];

const PreisePage: React.FC<Props> = ({ onNavigate, onRequestDraft, onLangChange }) => {
  const t = useCopy();
  const lang = useLang();
  const p = t.pricingPage;
  const home = spaLink(paths.home[lang], () => onNavigate('HOME'));
  const post = (slug: string) => spaLink(`/blog/${slug}`, () => onNavigate('BLOG_POST', slug));

  return (
    <div className="min-h-[100dvh] bg-ink text-ftext font-body">
      <div className="px-6 md:px-12 pt-20">
        <div className="flex justify-between items-center gap-4 mb-12">
          <a
            {...home}
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors font-mono text-sm uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            {p.back}
          </a>
          <LangSwitch onChange={onLangChange} />
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-4">
          <div className="font-mono text-[14px] text-accent uppercase mb-5">{t.pricing.pageEyebrow}</div>
          <h1 className="font-syne font-extrabold uppercase text-[clamp(34px,5.5vw,70px)] tracking-[-0.02em] leading-[1.02] mb-6">
            {p.h1[0]} <span className="text-accent">{p.h1[1]}</span>
          </h1>
          <p className="text-lg text-muted leading-[1.7]">{p.intro}</p>
        </div>
      </div>

      <PricingSection onRequestDraft={onRequestDraft} />

      {/* Was den Preis beeinflusst */}
      <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
        <div className="mb-[52px] max-w-3xl">
          <h2 className="font-syne font-extrabold uppercase text-[clamp(28px,3.5vw,44px)] tracking-[-0.015em] mb-4">
            {p.factorsTitle}
          </h2>
          <p className="text-muted text-lg">{p.factorsIntro}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          {p.factors.map((f, i) => {
            const Icon = factorIcons[i];
            return (
              <div key={f.title} className="bg-ink hover:bg-panel transition-colors p-9">
                <Icon className="w-6 h-6 text-accent mb-4" strokeWidth={1.5} />
                <h3 className="font-syne font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-[16px] leading-[1.6]">{f.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-8 border border-line bg-panel">
          <h3 className="font-syne font-bold text-lg mb-2">{p.ownTitle}</h3>
          <p className="text-muted text-[16px] leading-[1.6]">
            {p.ownText}
            {p.ownLink && (
              <>
                {' '}
                <a
                  {...post('individuelles-backend-vs-wordpress')}
                  className="text-accent hover:text-ftext transition-colors"
                >
                  {p.ownLink}
                </a>
              </>
            )}
          </p>
        </div>

        {p.guide && (
          <p className="text-muted text-[15px] mt-8">
            {p.guide.before}{' '}
            <a
              {...post('was-kostet-eine-website-berlin')}
              className="text-accent hover:text-ftext transition-colors"
            >
              {p.guide.link}
            </a>{' '}
            {p.guide.after}
          </p>
        )}
      </section>

      <TestimonialsSection />
      <FAQSection />

      {/* CTA */}
      <section className="px-6 md:px-12 bg-accent text-ink py-16 md:py-24 text-center">
        <h2 className="font-syne font-extrabold uppercase text-[clamp(34px,5vw,60px)] tracking-[-0.02em] mb-4">
          {p.ctaTitle}
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">{p.ctaText}</p>
        <MagneticButton
          as="button"
          onClick={onRequestDraft}
          className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-ink text-ftext px-7 py-4 border border-ink hover:bg-transparent hover:text-ink transition-colors"
        >
          {p.ctaButton}
        </MagneticButton>
      </section>

      {/* Mini footer */}
      <footer className="px-6 md:px-12 py-10 border-t border-line">
        <div className="flex flex-wrap justify-center gap-8 font-mono text-[14px] uppercase">
          <a {...home} className="text-muted hover:text-accent transition-colors">{p.footerHome}</a>
          {t.footer.blog && (
            <a {...spaLink('/blog', () => onNavigate('BLOG'))} className="text-muted hover:text-accent transition-colors">{t.footer.blog}</a>
          )}
          {t.industries && (
            <>
              <a {...spaLink('/website-fuer-handwerker', () => onNavigate('HANDWERK'))} className="text-muted hover:text-accent transition-colors">{t.industries.handwerk}</a>
              <a {...spaLink('/website-fuer-praxen', () => onNavigate('PRAXIS'))} className="text-muted hover:text-accent transition-colors">{t.industries.praxis}</a>
            </>
          )}
          <a {...spaLink('/imprint', () => onNavigate('IMPRINT'))} className="text-muted hover:text-accent transition-colors">{t.footer.imprint}</a>
          <a {...spaLink('/privacy', () => onNavigate('PRIVACY'))} className="text-muted hover:text-accent transition-colors">{t.footer.privacy}</a>
        </div>
      </footer>
    </div>
  );
};

export default PreisePage;
