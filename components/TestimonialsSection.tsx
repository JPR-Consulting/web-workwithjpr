import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Diana Römer Duque',
      company: 'COLOMBINA — Catering & Kochkurse',
      logo: '/logos/colombina.webp',
      quote: 'Meine Kurstermine, Texte und Anfragen verwalte ich jetzt einfach selbst — und die Seite fühlt sich trotzdem hundertprozentig nach meiner Marke an. Dass das alles an einem Tag entstanden ist, kann ich immer noch nicht ganz glauben.',
    },
    {
      name: 'Michael Nüske',
      company: 'ropeFX — Industriekletterer Berlin',
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

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Kundenstimmen</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Das sagen unsere Kunden</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-zinc-800/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 relative flex flex-col"
            >
              <Quote className="w-8 h-8 text-cyan-500/20 absolute top-6 right-6" />
              <p className="text-gray-300 leading-relaxed text-lg italic pr-8 flex-1">
                &bdquo;{t.quote}&ldquo;
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <img src={t.logo} alt={t.company} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Review CTA */}
        <div className="flex justify-center mt-12">
          <a
            href="https://g.page/r/Cbent0mi4nueEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Auch zufrieden? <span className="underline underline-offset-2">Bewertung auf Google hinterlassen</span></span>
            <span className="text-yellow-400">★★★★★</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
