// Texte der Landingpage /dresden (nur Deutsch, Du-Form): Toms Seite für Betriebe in Dresden.
// Die Dresden-Unit läuft unter der JPR Consulting GmbH (Entscheidung Jan, 02.11.2026).
// Komponente (components/DresdenPage.tsx) und Prerender (scripts/prerender.mjs) lesen dieselbe Quelle.
// Preise kommen bewusst aus site-copy.ts (copy.de.pricing), damit sie überall gleich bleiben.

import { copy, type SiteCopy } from './site-copy';

// Toms Seite liegt seit 13.11.2026 unter /tom-nowak (Jan); /dresden und /tom.nowak leitet vercel.json dauerhaft hierher um.
// Die Bilder bleiben unter /dresden/*, damit bestehende Bild-Adressen weiter funktionieren.
export const dresdenPath = '/tom-nowak';

/** Entwurf-Dialog in Du-Form: erbt von copy.de.draft (dort schon Du) und überschreibt nur das Dresden-Eigene. */
const draft: SiteCopy['draft'] = {
  ...copy.de.draft,
  heroLabel: 'Deine aktuelle Website',
  heroPlaceholder: 'deine-firma.de',
  // Ohne Website (Jan, 22.11.2026): einheitlich an Hero-Feld, Schluss-Feld, Dialog und FAQ
  heroHint: 'Noch keine Website? Feld leer lassen, dann meldet sich Tom.',
  call: 'Lieber erst sprechen? Termin buchen →',
  submit: 'Entwurf anfragen →',
  q1: {
    title: 'Um welchen Betrieb geht es?',
    company: 'Name des Betriebs',
    companyPlaceholder: 'z. B. Haustechnik Müller',
    website: 'Aktuelle Website',
    websiteHint: 'Noch keine Website? Feld leer lassen, dann meldet sich Tom.',
  },
  q2: {
    title: 'In welcher Branche bist du?',
    options: ['Handwerk', 'Praxis & Therapie', 'Fahrzeug-Ausstattung & Car-HiFi', 'Etwas anderes'],
  },
  q3: {
    title: 'Was soll die neue Website vor allem bringen?',
    hint: 'Mehrere Antworten möglich.',
    options: ['Mehr Anfragen', 'Mehr Bewerbungen', 'Online-Termine', 'Besser bei Google gefunden werden'],
    note: 'Noch etwas, das wir wissen sollten? (optional)',
  },
  q4: {
    title: 'Wohin sollen wir den Entwurf schicken?',
    name: 'Dein Name',
    email: 'E-Mail',
    phone: 'Telefon (optional)',
    phoneHint: 'Für kurze Rückfragen zum Entwurf.',
    privacy: 'Wir nutzen deine Angaben für deinen Entwurf und die Rückmeldung dazu. Mehr in der',
    privacyLink: 'Datenschutzerklärung',
  },
  errors: {
    company: 'Bitte trag den Namen deines Betriebs ein.',
    industry: 'Bitte wähl eine Branche aus.',
    name: 'Bitte trag deinen Namen ein.',
    email: 'Bitte trag eine gültige E-Mail-Adresse ein.',
    send: 'Das hat gerade nicht geklappt. Schreib uns bitte kurz an',
  },
  success: {
    title: 'Danke, {name}!',
    text: 'Wir bauen jetzt deinen Entwurf. Du bekommst ihn innerhalb von 48 Stunden an {email}. Die Bestätigung ist schon unterwegs.',
    call: 'Lieber vorher kurz sprechen? 30 Minuten buchen →',
    close: 'Fertig',
  },
};

export const dresden = {
  /** Wird an `source` der Anfrage angehängt („workwithjpr.com · Entwurf-Formular · dresden“), so sieht Jan die Herkunft. */
  sourceTag: 'dresden',
  // v4 (22.11.2026): Du-Form, 8 Abschnitte (tom-v4/decisions.md). Reihenfolge der Seite:
  // Hero · Vorher/Nachher · KI-Assistent · Beispiel-Entwürfe · Beweis (206 + Zitate) · Ablauf mit Tom · Preise · FAQ · Schluss
  meta: {
    title: 'Webdesign Dresden: Entwurf in 48 Stunden gratis | JPR Studio',
    desc: 'Website für Handwerk, Praxen und Car-HiFi in Dresden. Den Entwurf siehst du, bevor du zahlst: in 48 Stunden, mit KI-Assistent. Festpreis ab 1.500 € netto.',
  },
  nav: { place: 'Dresden', cta: 'Entwurf anfragen' },
  hero: {
    eyebrow: 'Für Handwerk, Praxen und Car-HiFi in Dresden',
    // H1 in drei Teilen: der mittlere wird kursiv im Akzent gesetzt
    h1: ['Du siehst deine neue Website,', 'bevor', 'du einen Euro bezahlst.'],
    sub: 'Eine Website, über die Kunden anfragen und Bewerber sich melden. Den Entwurf bauen wir in 48 Stunden aus deiner jetzigen Seite.',
    tomCard: { name: 'Tom Nowak', role: 'Dein Ansprechpartner in Dresden' },
    deviceAlt: 'Beispiel-Entwurf einer Website für einen Car-HiFi-Betrieb auf dem Rechner und für einen Heizungsbauer auf dem Handy',
  },
  beforeAfter: {
    title: 'Der Kunde hat dich gefunden. Und dann?',
    intro: 'Wir haben 46 Websites von Handwerksbetrieben in Dresden geprüft. Diese vier Dinge fehlen besonders oft.',
    colBefore: 'Heute oft',
    colAfter: 'Mit neuer Website',
    // Regler-Beschriftung (Jan, 22.11.2026) und Name der Attrappe (erfunden, kein echter Betrieb)
    sliderBefore: 'Deine Seite heute',
    sliderAfter: 'Dein Entwurf',
    mockName: 'Mustermann Haustechnik',
    pairs: [
      {
        label: 'Telefon',
        before: 'Die Nummer ist am Handy nicht antippbar. Wer anrufen will, muss abschreiben.',
        after: 'Ein Tipp, und bei dir klingelt es.',
        stat: 'bei 33 von 46',
      },
      {
        label: 'Anfrage',
        before: 'Kein Formular. Wer lieber schreibt, muss selbst eine Mail aufsetzen.',
        after: 'Ein Formular am Handy. Auch abends, auch sonntags.',
        stat: 'bei 23 von 46',
      },
      {
        label: 'Bewerbung',
        before: 'Keine Seite für Bewerber. Ein Geselle sieht nicht, dass du suchst.',
        after: 'Eine Karriereseite. Bewerben geht am Handy.',
        stat: 'bei 37 von 46',
      },
      {
        label: 'Arbeiten',
        before: 'Keine Referenzen. Besucher sehen nicht, was du gebaut hast.',
        after: 'Deine Arbeiten als Bilder. Handyfotos reichen.',
        stat: 'bei 30 von 46',
      },
    ],
    footnote: 'Eigene automatische Prüfung im November 2026, nur erreichbare Websites.',
  },
  voice: {
    eyebrow: 'KI-Assistent · in jedem Entwurf',
    title: 'Deine Website nimmt Aufträge an. Per Sprache.',
    intro: 'Kunden erzählen, worum es geht. Der Assistent fragt nach, was du fürs Angebot brauchst. Du bekommst eine fertige Auftragskarte.',
    rules: [
      'Sagt im ersten Satz, dass er eine KI ist',
      'Nimmt keinen Ton auf',
      'Preise und Termine sagst du zu, nicht die KI',
    ],
    note: 'In Praxen notiert er Terminwünsche, beim Car-HiFi fragt er Fahrzeug und Baujahr ab.',
    // Gesprächsausschnitt und Auftragskarte: gestaltetes Beispiel, kein Live-Assistent auf dieser Seite
    demoTitle: 'Auftrag per Sprache aufgeben',
    demoLabel: 'Beispiel · Wendler Haustechnik',
    // Bewusst „Sie“: Hier spricht die KI eines Heizungsbetriebs mit dessen Kundin, nicht wir mit dem Leser.
    chat: [
      { who: 'ki', text: 'Hallo, hier ist die KI-Assistentin von Wendler Haustechnik. Worum geht es?' },
      { who: 'kunde', text: 'Unsere Heizung ist seit heute früh aus. Altbau, zweiter Stock.' },
      { who: 'ki', text: 'Das notiere ich als dringend. In welchem Stadtteil sind Sie?' },
    ] as { who: 'ki' | 'kunde'; text: string }[],
    card: {
      number: 'Auftrag A-1042',
      badge: 'Dringend',
      rows: [
        ['Anliegen', 'Heizung ausgefallen'],
        ['Objekt', 'Altbau, 2. OG'],
        ['Ort', 'Dresden-Striesen'],
        ['Erreichbar', 'heute bis 18 Uhr'],
        ['Fotos', 'Foto-Link erstellt'],
      ] as [string, string][],
    },
  },
  examples: {
    title: 'Drei Branchen. Drei Entwürfe.',
    text: 'Die Betriebe sind erfunden, die Entwürfe echt gebaut. Dein Entwurf zeigt deine Leistungen und deine Fotos.',
    badge: 'Beispiel-Entwurf',
    // tab = Reiter-Name
    items: [
      { tab: 'Handwerk', title: 'Wendler Haustechnik', tag: 'Heizung & Sanitär · warm und kräftig', img: '/dresden/beispiel-shk' },
      { tab: 'Praxen', title: 'Physio am Lindenplatz', tag: 'Physiotherapie · hell und ruhig', img: '/dresden/beispiel-praxis' },
      { tab: 'Fahrzeug', title: 'Elbklang Car-HiFi', tag: 'Car-HiFi & Nachrüstung · dunkel und präzise', img: '/dresden/beispiel-carhifi' },
    ],
  },
  // Beweis: Kundenprojekt (White-Label: kein Name, keine URL, kein Logo) + die zwei Zitate in einem Abschnitt
  caseStudy: {
    kicker: 'Kundenprojekt · Kampfsportverein in Berlin',
    count: 206,
    countLabel: 'Personen haben sich online zum Probetraining angemeldet',
    countNote: 'seit März 2026',
    title: 'Ohne einen Euro Werbung.',
    old: 'Vorher: kein Weg zum Probetraining.',
    now: 'Heute: ein Knopf „Probetraining buchen“.',
    bridge: 'Anderes Geschäft, gleicher Moment. Bei dir heißt der Knopf „Anfrage senden“ oder „Termin buchen“.',
    cta: 'Kostenlosen Entwurf anfragen',
    // Wortlaut unverändert aus copy.de.testimonials.items, ohne Namen, Firma und Logo
    quotes: [
      { quote: copy.de.testimonials.items[1].quote, who: 'Kampfsportverein, Berlin' },
      { quote: copy.de.testimonials.items[0].quote, who: 'Industriekletter-Betrieb, Berlin' },
    ],
  },
  tom: {
    initials: 'TN',
    name: 'Tom Nowak',
    role: 'Dein Ansprechpartner in Dresden',
    // TODO(Jan): Toms Telefon eintragen, sobald es sie gibt. Leer = wird nicht angezeigt. Keine Platzhalter-Nummern.
    phone: '',
    email: 'tom@workwithjpr.com',
    // Foto (13.11.2026): freigestelltes Farbporträt, 800×800, plus kleiner Avatar auf Kobalt-Verlauf
    photo: {
      cutout: '/dresden/tom-nowak-portrait',
      avatar: '/dresden/tom-nowak-avatar.webp',
      alt: 'Tom Nowak, Ansprechpartner von JPR Studio in Dresden',
    },
    emailLabel: 'E-Mail an Tom',
    title: 'Den Entwurf zeigt dir Tom. Gern bei dir im Betrieb.',
    text: 'Oder am Telefon, wie es dir lieber ist. Gebaut wird im Team von JPR Studio.',
    // TODO(Jan/Tom): optional ein Satz von Tom in eigenen Worten, nur wenn er ihn freigibt. Leer = ausgeblendet.
    personal: '',
  },
  process: {
    title: 'Von dir brauchen wir zwei Minuten und ein Gespräch.',
    steps: [
      { title: 'Website eintragen', desc: 'Adresse und vier kurze Fragen. Zwei Minuten.' },
      { title: 'Entwurf in 48 Stunden', desc: 'Aus deiner jetzigen Seite. Texte, Bilder und Technik machen wir.' },
      { title: 'Gespräch und Festpreis', desc: 'Gefällt dir der Entwurf, bekommst du ein Angebot zum Festpreis.' },
    ],
  },
  pricing: {
    title: 'Festpreis, bevor es losgeht.',
    reco: 'Empfohlen',
    allFeatures: 'Alle Leistungen',
    tiers: [
      {
        name: 'Starter', price: 'ab 1.500 €', reco: false,
        for: 'Wenn du vor allem angerufen werden willst.',
        features: ['Eine Seite, fürs Handy gebaut', 'Kontaktformular und Google Maps', 'Grundlagen für Google (Basis-SEO)', '1 Korrekturschleife'],
      },
      {
        name: 'Professional', price: 'ab 3.000 €', reco: true,
        for: 'Für mehrere Leistungen, ein Team und Online-Termine.',
        features: ['Mehrere Seiten: Leistungen, Team, Galerie', 'Online-Terminbuchung', 'Erweiterte Optimierung für Google (SEO)', 'Besucherzahlen mit Google Analytics', '3 Korrekturschleifen, Einführung und Support'],
      },
      {
        name: 'Business', price: 'ab 5.000 €', reco: false,
        for: 'Wenn du online verkaufen oder Abläufe automatisieren willst.',
        features: ['Alles aus Professional', 'Online-Shop oder Web-App', 'Kundenverwaltung', 'Eigene Funktionen und Automatisierungen', 'Laufender Support, unbegrenzte Korrekturen'],
      },
    ],
    care: 'Betreuung ab 49 €/Monat: Hosting, Updates, Backups, Support',
    voice: 'KI-Assistent für die fertige Website: auf Wunsch, Preis im Angebot',
    note: 'Alle Preise netto zzgl. MwSt.',
    cta: 'Kostenlosen Entwurf anfragen',
  },
  faq: {
    title: 'Häufige Fragen.',
    items: [
      { q: 'Wann ist die fertige Website online?', a: 'Einfache Seiten in wenigen Tagen, mit Shop oder Extras in ein bis zwei Wochen.' },
      { q: 'Ich habe noch keine Website.', a: 'Lass das Feld leer, dann meldet sich Tom bei dir. Er bespricht mit dir deinen Betrieb, danach bekommst du ein Angebot für deine erste Website. Oder schreib ihm direkt an tom@workwithjpr.com.' },
      { q: 'Wem gehört die Website am Ende?', a: 'Dir: Code, Domain und alle Zugänge. Weiterführen kann sie jederzeit auch jemand anderes.' },
    ],
  },
  cta: {
    title: ['Erst sehen.', 'Dann entscheiden.'],
    text: 'Trag deine Website ein. In 48 Stunden hast du deinen Entwurf im Postfach.',
    button: 'Kostenlosen Entwurf anfragen',
    mail: 'Lieber erst mit Tom sprechen? tom@workwithjpr.com',
  },
  // Schlichte Beschriftungen für Bedienelemente (aria-label), keine Werbetexte
  ui: {
    stackLabel: 'Beispiel-Entwürfe',
    stackDot: 'Entwurf anzeigen',
    sliderLabel: 'Vorher-Nachher-Regler',
    lightboxClose: 'Schließen',
    lightboxDesktop: 'Rechner',
    lightboxMobile: 'Handy',
    mockAlt: 'Gestaltete Attrappe einer typischen älteren Handwerker-Website',
  },
  footer: { home: 'Startseite', imprint: 'Impressum', privacy: 'Datenschutz', terms: 'AGB', companyEmail: 'info@workwithjpr.com', tomLine: 'Ansprechpartner in Dresden: Tom Nowak' },
  sticky: 'Kostenlosen Entwurf anfragen',
  draft,
};

export type DresdenCopy = typeof dresden;
