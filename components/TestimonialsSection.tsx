import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { useCopy } from '../i18n';
import type { Testimonial } from '../content/site-copy';

const TestimonialCell: React.FC<Testimonial> = ({ quote, logo, name, company }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal bg-ink hover:bg-panel transition-colors p-9 flex flex-col justify-between">
      <p className="text-[18px] leading-[1.65] text-[#d8d8de] mb-7">&bdquo;{quote}&ldquo;</p>
      <div className="flex items-center gap-3.5">
        <img src={logo} alt={`${company} Logo`} className="h-10 w-auto max-w-[90px] object-contain" />
        <div className="font-mono text-[14px] text-muted uppercase leading-[1.8]">
          {name}<br />{company}
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const all = useCopy();
  const t = all.testimonials;
  // Svens Zitat steht schon im Kundenprojekt unter dem Hero (SubyenCase), hier nicht doppelt.
  const items = t.items.filter((i) => i.name !== all.caseStudy.person);
  const single = items.length === 1;
  const eyebrowRef = useReveal<HTMLDivElement>();
  const titleRef = useReveal<HTMLHeadingElement>();
  return (
    <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
      <div ref={eyebrowRef} className="reveal font-mono text-[14px] text-accent uppercase mb-5">{t.eyebrow}</div>
      <h2
        ref={titleRef}
        className="font-syne font-extrabold uppercase text-[clamp(18px,5.4vw,34px)] md:text-[clamp(34px,4.5vw,60px)] hyphens-manual tracking-[-0.015em] leading-[1.02] mb-[52px] sec-title-line"
      >
        <span>{t.title}</span>
      </h2>

      <div className={`grid grid-cols-1 gap-px bg-line border border-line ${single ? 'max-w-[900px]' : 'md:grid-cols-2'}`}>
        {items.map((item) => (
          <TestimonialCell key={item.name} {...item} />
        ))}
      </div>

      {t.note && <p className="mt-4 font-body text-[14px] text-muted">{t.note}</p>}
      <p className="mt-7 font-mono text-[14px] uppercase">
        <a href="https://g.page/r/Cbent0mi4nueEAE/review" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ftext transition-colors">
          {t.reviewCta}
        </a>
      </p>
    </section>
  );
};

export default TestimonialsSection;
