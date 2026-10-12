// Texte der Landingpage /website-fuer-praxen (nur Deutsch, Ziel der Google-Ads-Suchkampagne „Praxis“).
// Gleiche Struktur wie handwerk-copy.ts; Komponente (components/LandingPage.tsx) und Prerender
// lesen dieselbe Quelle. Die Seite läuft im hellen Thema (theme: 'light').

import type { LandingCopy } from './handwerk-copy';

export const praxisPath = '/website-fuer-praxen';

export const praxis: LandingCopy = {
  theme: 'light',
  sourceTag: 'lp-praxis',
  presetIndustry: 1,
  meta: {
    title: 'Website für Praxen — mehr Patienten, Festpreis ab 1.500 € | JPR Studio',
    desc: 'Websites für Arztpraxen, Zahnärzte, Physiotherapie und Therapiepraxen: bei Google gefunden, Online-Termine, weniger Telefon. Kostenloser Entwurf in 48 Stunden, Festpreis ab 1.500 €.',
  },
  nav: { cta: 'Kostenlosen Entwurf anfragen →', ctaShort: 'Entwurf anfragen →', all: 'Alle Leistungen' },
  hero: {
    topLeft: 'Websites für Praxen — deutschlandweit',
    topRight: 'Festpreis · Entwurf kostenlos',
    h1: ['Website für', 'Praxen,', 'die Patienten finden.'],
    img: { base: '/praxis/praxis-hero', flip: false, pos: 'object-[60%_25%] lg:object-center' },
    imgAlt: 'Physiotherapeutin in einer hellen Praxis, die lächelnd auf ihrem Smartphone einen Online-Terminkalender ansieht',
    audience: 'Für Arztpraxen, Zahnärzte, Physiotherapie, Psychotherapie, Ergotherapie, Logopädie und Heilpraktiker.',
    formTitle: 'Kostenloser Entwurf in 48 Stunden',
    offer: 'Trag die Website deiner Praxis ein. Wir schicken dir einen anklickbaren Entwurf der neuen Seite. Danach entscheidest du, Festpreis ab 1.500 €.',
    cta: 'Kostenlosen Entwurf anfragen →',
    proofs: ['Entwurf in 48 Stunden', 'Festpreis vor Projektstart', 'Online-Termine eingebunden', 'Impressum & Datenschutz sauber'],
  },
  trades: {
    ariaLabel: 'Fachrichtungen',
    label: 'Für jede Praxis',
    items: ['Hausarzt', 'Zahnarzt', 'Physiotherapie', 'Psychotherapie', 'Ergotherapie', 'Logopädie', 'Kieferorthopädie', 'Dermatologie', 'Osteopathie', 'Heilpraktiker'],
  },
  problem: {
    eyebrow: '[01] — Kennst du das?',
    title: 'Volles Wartezimmer. Volles Telefon.',
    items: [
      { title: 'Das Telefon klingelt ununterbrochen', desc: 'Terminwünsche, Öffnungszeiten, „Nehmen Sie noch neue Patienten?“ — dein Team hängt am Hörer, statt sich um die Patienten vor Ort zu kümmern.' },
      { title: 'Die Website ist von 2015', desc: 'Am Handy kaum lesbar, alte Fotos, keine Online-Termine. Patienten vergleichen Praxen im Netz — und gehen zu der, die vertrauenswürdig wirkt.' },
      { title: 'Die falschen Patienten', desc: 'Wer deine Schwerpunkte nicht findet, ruft mit dem falschen Anliegen an. Eine klare Website zeigt, wofür deine Praxis steht.' },
      { title: 'Kein Personal in Sicht', desc: 'MFA und Therapeuten suchen ihren Arbeitgeber auch online. Ohne Karriereseite bewerben sie sich bei der Praxis nebenan.' },
    ],
  },
  features: {
    eyebrow: '[02] — Was deine neue Website kann',
    title: 'Gebaut für Praxen.',
    items: [
      { title: 'Online-Termine', desc: 'Wir binden dein Buchungssystem ein, zum Beispiel Doctolib, oder bauen eine einfache Terminanfrage. Patienten buchen abends vom Sofa, dein Telefon bleibt ruhiger.' },
      { title: 'Vertrauen auf den ersten Blick', desc: 'Team, Räume und Schwerpunkte mit echten Fotos. Patienten wissen vor dem ersten Besuch, wer sie behandelt.' },
      { title: 'Bei Google in deiner Stadt', desc: 'Eigene Seiten für deine Leistungen, sauber eingerichtetes Google-Unternehmensprofil. So findet man dich, wenn man „Physiotherapie + Ort“ sucht.' },
      { title: 'Rechtlich sauber', desc: 'Impressum mit den Pflichtangaben für Heilberufe, Datenschutzerklärung, Cookie-Hinweis. Keine Google Fonts von fremden Servern.' },
    ],
  },
  reference: {
    eyebrow: '[03] — So sieht dein Entwurf aus',
    title: 'Drei Beispiel-Entwürfe.',
    text: 'So sieht ein Entwurf aus, wie du ihn nach 48 Stunden bekommst. Die drei Praxen hier sind erfunden. Deiner zeigt deine Leistungen, dein Team und deine Räume.',
    href: '',
    url: '',
    img: '',
    alt: '',
    link: '',
    moreLabel: '',
    exclude: '',
    demos: [
      { title: 'Physio Westend', tag: 'Physiotherapie · ruhig und natürlich', img: '/praxis/demo-physio.jpg', alt: 'Beispiel-Entwurf der Website einer fiktiven Physiotherapie-Praxis' },
      { title: 'Zahnarztpraxis am Markt', tag: 'Zahnarzt · klar und hell', img: '/praxis/demo-zahnarzt.jpg', alt: 'Beispiel-Entwurf der Website einer fiktiven Zahnarztpraxis' },
      { title: 'Praxis für Psychotherapie', tag: 'Psychotherapie · warm und geschützt', img: '/praxis/demo-psychotherapie.jpg', alt: 'Beispiel-Entwurf der Website einer fiktiven Psychotherapie-Praxis' },
    ],
    demoBadge: 'Beispiel-Entwurf · fiktive Praxis',
  },
  process: {
    eyebrow: '[04] — Ablauf',
    title: 'In drei Schritten online.',
    steps: [
      { title: 'Website eintragen', desc: '2 Minuten, 4 kurze Fragen, ganz ohne Termin. Noch keine Website? Auch kein Problem.' },
      { title: 'Entwurf in 48 Stunden', desc: 'Du bekommst einen anklickbaren Entwurf per Mail — schau ihn dir nach der Sprechstunde in Ruhe an.' },
      { title: 'Festpreis & Launch', desc: 'Gefällt er dir, bekommst du einen Festpreis. Wir bauen, du gibst Feedback. In 2–3 Wochen ist die neue Seite online.' },
    ],
  },
  pricingEyebrow: 'Preise — Festpreis vor Start',
  faq: {
    eyebrow: '[05] — FAQ',
    title: 'Fragen von Praxen.',
    items: [
      { q: 'Wir haben in der Praxis keine Zeit dafür.', a: 'Müsst ihr auch nicht. Du trägst eure Website ein und beantwortest 4 Fragen. Aufbau, Technik und Einrichtung übernehmen wir. Insgesamt brauchst du vielleicht eine Stunde — verteilt auf ein paar Rückmeldungen per Mail oder Telefon.' },
      { q: 'Könnt ihr unser Terminsystem einbinden?', a: 'Ja. Nutzt ihr schon ein Buchungssystem wie Doctolib, binden wir es ein. Habt ihr keins, bauen wir eine einfache Terminanfrage, die per Mail bei euch ankommt.' },
      { q: 'Was ist mit Datenschutz und Impressum?', a: 'Wir richten Impressum mit den Pflichtangaben für Heilberufe, Datenschutzerklärung und Cookie-Hinweis ein. Schriften und Skripte laufen ohne unnötige Drittanbieter. Eine Rechtsberatung ersetzt das nicht, deine Kammer oder dein Anwalt bleibt die letzte Instanz.' },
      { q: 'Wir haben keine guten Fotos.', a: 'Für den Entwurf reichen Handyfotos von Team und Räumen. Für die fertige Seite empfehlen wir einen kurzen Fototermin vor Ort, bis dahin nutzen wir passende Bilder.' },
      { q: 'Was kostet die Website?', a: 'Eine One-Page-Website beginnt bei 1.500 €, eine mehrseitige Website mit Terminbuchung bei 3.000 € — jeweils netto. Nach dem kostenlosen Entwurf bekommst du einen Festpreis.' },
      { q: 'Wem gehört die Website am Ende?', a: 'Dir — vollständig. Du bekommst Code, Domain und alle Zugänge. Kein Baukasten-Abo, keine Lizenzgebühren. Betreuung ab 49 €/Monat ist möglich, aber kein Muss.' },
      { q: 'Arbeitet ihr auch außerhalb von Berlin?', a: 'Ja, deutschlandweit. Alles läuft online: Entwurf per Link, Abstimmung per Telefon, Video oder Mail.' },
    ],
  },
  cta: {
    title: ['Mehr Patienten,', 'weniger Telefon.'],
    text: 'Trag die Website deiner Praxis ein — in 48 Stunden hast du einen kostenlosen Entwurf im Postfach.',
    button: 'Kostenlosen Entwurf anfragen →',
    call: 'Lieber erst sprechen? 30 Minuten per Video →',
  },
  about: { eyebrow: 'Dein Ansprechpartner', fact: 'Du sprichst direkt mit dem, der baut' },
  footer: { home: 'Startseite', pricing: 'Preise', blog: 'Blog' },
  sticky: 'Kostenlosen Entwurf anfragen →',
};
