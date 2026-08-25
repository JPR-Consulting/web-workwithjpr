import React, { useState, useRef } from 'react';

const faqs = [
  {
    q: 'Was kostet eine Website?',
    a: 'Das hängt vom Umfang ab. Eine einfache One-Page Website beginnt ab 1.500 €, eine mehrseitige Website mit Buchungssystem ab 3.000 €. Im kostenlosen Erstgespräch bekommst du ein individuelles Angebot — transparent, ohne versteckte Kosten.',
  },
  {
    q: 'Wie lange dauert es, bis meine Website fertig ist?',
    a: 'Eine einfache Website ist in wenigen Tagen fertig. Komplexere Projekte mit Shop oder individuellen Funktionen dauern 1–2 Wochen. Kein monatelanges Warten — wir setzen schnell um.',
  },
  {
    q: 'Brauche ich technisches Wissen?',
    a: 'Nein, überhaupt nicht. Wir kümmern uns um alles Technische. Nach dem Launch zeigen wir dir in einer Einführung, wie du einfache Änderungen selbst vornehmen kannst — falls gewünscht.',
  },
  {
    q: 'Was passiert nach dem Launch?',
    a: 'Hosting, Updates, Backups und Erreichbarkeit übernehme ich ab 49 €/Monat — inklusive Support und kleiner Änderungen. Wenn du lieber selbst betreust, bekommst du alle Zugänge und den Code.',
  },
  {
    q: 'Könnt ihr auch bestehende Websites überarbeiten?',
    a: 'Ja, definitiv. Ob Redesign, Performance-Optimierung oder neue Funktionen — wir schauen uns an, was du hast, und machen daraus etwas Modernes.',
  },
  {
    q: 'Kann ich Inhalte später selbst ändern?',
    a: 'Ja. Du bekommst einen einfachen Redaktionsbereich für Texte, Bilder, Öffnungszeiten und Preise — ohne Technikkenntnisse. Nach dem Launch zeige ich dir in einer Einführung, wie es geht.',
  },
  {
    q: 'Wem gehört die Website am Ende?',
    a: 'Dir — vollständig. Du bekommst den kompletten Quellcode und die Zugänge zu Domain und Hosting. Kein Baukasten-Abo, keine Lizenzgebühren, keine Abhängigkeit von mir.',
  },
  {
    q: 'Arbeitet ihr nur mit Unternehmen in Berlin?',
    a: 'Wir sind in Berlin ansässig und spezialisiert auf lokale Unternehmen. Aber wir arbeiten auch remote — der Standort spielt für digitale Projekte keine Rolle.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
      <div className="font-mono text-[13px] text-accent uppercase mb-5">FAQ</div>
      <h2 className="font-syne font-extrabold uppercase text-[clamp(34px,4.5vw,60px)] tracking-[-0.015em] leading-[1.02] mb-[52px]">
        Häufige Fragen.
      </h2>

      <div className="border-t border-line max-w-[980px]">
        {faqs.map((faq, idx) => (
          <FAQItem
            key={faq.q}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </section>
  );
};

const FAQItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center gap-6 py-[26px] bg-transparent border-none cursor-pointer text-left font-syne font-bold text-xl text-ftext hover:text-accent transition-colors"
      >
        {question}
        <span
          className="font-mono text-xl text-accent flex-shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.19,1,.22,1)]"
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 500}px` : '0px' }}
      >
        <div ref={contentRef}>
          <p className="pb-[26px] pr-10 text-[15px] leading-[1.7] text-muted max-w-[760px]">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
