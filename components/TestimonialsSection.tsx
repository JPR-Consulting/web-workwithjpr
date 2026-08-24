import React from 'react';
import { useReveal } from '../hooks/useReveal';

const testimonials = [
  {
    name: 'Diana Römer Duque',
    company: 'Colombina — Catering & Kochkurse',
    logo: '/logos/colombina.webp',
    quote: 'Meine Kurstermine, Texte und Anfragen verwalte ich jetzt einfach selbst — und die Seite fühlt sich trotzdem hundertprozentig nach meiner Marke an. Dass das alles an einem Tag entstanden ist, kann ich immer noch nicht ganz glauben.',
  },
  {
    name: 'Michael Nüske',
    company: 'RopeFX — Industriekletterer Berlin',
    logo: '/logos/ropefx.webp',
    quote: 'Die Website stand innerhalb weniger Tage. Seitdem bekommen wir regelmäßig Anfragen darüber — und sie sieht richtig professionell aus. Unkompliziert und auf den Punkt.',
  },
  {
    name: 'Sven Markulla',
    company: 'Muay Thai Subyen e.V.',
    logo: '/logos/muay-thai-subyen.webp',
    quote: 'Innerhalb einer Woche hatten wir eine komplette Website mit Trainingsplan, Mitgliederverwaltung und Online-Vertragsabschluss. Das hätte ich so schnell nicht erwartet.',
  },
];

const TestimonialCell: React.FC<{ quote: string; logo: string; alt: string; name: string; company: string }> = ({ quote, logo, alt, name, company }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal bg-ink hover:bg-panel transition-colors p-9 flex flex-col justify-between">
      <p className="text-[17px] leading-[1.65] text-[#d8d8de] mb-7">&bdquo;{quote}&ldquo;</p>
      <div className="flex items-center gap-3.5">
        <img src={logo} alt={alt} className="h-10 w-auto max-w-[90px] object-contain" />
        <div className="font-mono text-[13px] text-muted uppercase leading-[1.9]">
          {name}<br />{company}
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
      <div className="font-mono text-[13px] text-accent uppercase mb-5">Kundenstimmen</div>
      <h2 className="font-syne font-extrabold uppercase text-[clamp(34px,4.5vw,60px)] tracking-[-0.015em] leading-[1.02] mb-[52px]">
        Das sagen unsere Kunden.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
        {testimonials.map((t) => (
          <TestimonialCell key={t.name} quote={t.quote} logo={t.logo} alt={`${t.company} Logo`} name={t.name} company={t.company} />
        ))}
      </div>

      <p className="mt-7 font-mono text-[13px] uppercase">
        <a href="https://g.page/r/Cbent0mi4nueEAE/review" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ftext transition-colors">
          Auch zufrieden? Bewertung auf Google hinterlassen →
        </a>
      </p>
    </section>
  );
};

export default TestimonialsSection;
