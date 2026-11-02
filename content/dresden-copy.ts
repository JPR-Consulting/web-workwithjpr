// Texte der Landingpage /dresden (nur Deutsch, Sie-Form): Toms Seite für Betriebe in Dresden.
// Die Dresden-Unit läuft unter der JPR Consulting GmbH (Entscheidung Jan, 02.11.2026).
// Komponente (components/DresdenPage.tsx) und Prerender (scripts/prerender.mjs) lesen dieselbe Quelle.
// Preise kommen bewusst aus site-copy.ts (copy.de.pricing), damit sie überall gleich bleiben.

import { copy, type SiteCopy } from './site-copy';

export const dresdenPath = '/dresden';

/** Entwurf-Dialog in Sie-Form; gleicher Aufbau wie copy.de.draft, damit der Dialog unverändert bleibt. */
const draft: SiteCopy['draft'] = {
  ...copy.de.draft,
  heroLabel: 'Ihre aktuelle Website',
  heroPlaceholder: 'ihre-firma.de',
  heroHint: 'Noch keine Website? Einfach leer lassen.',
  call: 'Lieber erst sprechen? Termin buchen →',
  q1: {
    title: 'Um welchen Betrieb geht es?',
    company: 'Name des Betriebs',
    companyPlaceholder: 'z. B. Haustechnik Müller',
    website: 'Aktuelle Website',
    websiteHint: 'Noch keine? Dann einfach leer lassen.',
  },
  q2: {
    title: 'In welcher Branche sind Sie?',
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
    name: 'Ihr Name',
    email: 'E-Mail',
    phone: 'Telefon (optional)',
    phoneHint: 'Für kurze Rückfragen zum Entwurf.',
    privacy: 'Wir nutzen Ihre Angaben für Ihren Entwurf und die Rückmeldung dazu. Mehr in der',
    privacyLink: 'Datenschutzerklärung',
  },
  errors: {
    company: 'Bitte den Namen Ihres Betriebs eintragen.',
    industry: 'Bitte eine Branche auswählen.',
    name: 'Bitte Ihren Namen eintragen.',
    email: 'Bitte eine gültige E-Mail-Adresse eintragen.',
    send: 'Das hat gerade nicht geklappt. Schreiben Sie uns bitte kurz an',
  },
  success: {
    title: 'Danke, {name}!',
    text: 'Wir bauen jetzt Ihren Entwurf. Sie bekommen ihn innerhalb von 48 Stunden an {email}. Eine Bestätigung ist schon unterwegs.',
    call: 'Lieber vorher kurz sprechen? 30 Minuten buchen →',
    close: 'Fertig',
  },
};

export const dresden = {
  /** Wird an `source` der Anfrage angehängt („workwithjpr.com · Entwurf-Formular · dresden“), so sieht Jan die Herkunft. */
  sourceTag: 'dresden',
  meta: {
    title: 'Website für Betriebe in Dresden — Entwurf kostenlos vorab | JPR Studio',
    desc: 'Neue Website für Handwerk, Praxen und Fahrzeug-Ausstattung in Dresden: Sie sehen Ihre neue Seite, bevor Sie etwas bezahlen. Mit KI-Assistent, der Anfragen per Sprache annimmt. Festpreis ab 1.500 €.',
  },
  nav: { place: 'Dresden', cta: 'Entwurf anfragen' },
  hero: {
    eyebrow: 'Websites für Betriebe in Dresden',
    // H1 in drei Teilen: der mittlere wird kursiv und golden gesetzt
    h1: ['Sie sehen Ihre neue Website,', 'bevor', 'Sie etwas bezahlen.'],
    sub: 'Für Handwerk, Praxen und Fahrzeug-Ausstattung: eine Website, die Anfragen und Bewerbungen bringt. Den Entwurf bauen wir vorab und kostenlos, aus Ihrer bisherigen Seite.',
    cta: 'Kostenlosen Entwurf anfragen',
    secondary: 'Beispiele ansehen',
    proofs: ['Festpreis ab 1.500 €', 'KI-Assistent in jedem Entwurf', 'JPR Consulting GmbH'],
    deviceAlt: 'Beispiel-Entwurf einer Website für einen Car-HiFi-Betrieb auf dem Rechner und für einen Heizungsbauer auf dem Handy',
  },
  tom: {
    initials: 'TN',
    name: 'Tom Nowak',
    role: 'Ihr Ansprechpartner in Dresden',
    // TODO(Jan): Toms Telefon und E-Mail eintragen, sobald es sie gibt. Leer = wird nicht angezeigt.
    // Keine Platzhalter-Nummern. Ein Foto gibt es noch nicht, deshalb das Monogramm.
    phone: '',
    email: '',
    eyebrow: 'Persönlich vor Ort',
    title: 'Ein Ansprechpartner in Dresden.',
    text: 'Tom Nowak zeigt Ihnen Ihren Entwurf, gern bei Ihnen im Betrieb, und klärt mit Ihnen, was die Seite können soll. Gebaut wird im Team von JPR Studio, mit festem Preis und festem Ablauf.',
    cta: 'Entwurf anfragen',
  },
  audience: {
    label: 'Für',
    items: ['Handwerk', 'Praxen & Therapie', 'Fahrzeug-Ausstattung & Car-HiFi'],
  },
  outcomes: {
    eyebrow: 'Was die neue Website erledigt',
    title: 'Mehr Anfragen. Mehr Bewerbungen. Weniger Telefon.',
    items: [
      { title: 'Anfragen, mit denen Sie arbeiten können', desc: 'Kunden wählen die Leistung, laden Fotos hoch und geben ihren Ort an. Bei Ihnen kommt eine vollständige Anfrage an, statt einer Bitte um Rückruf.' },
      { title: 'Bewerbung in 60 Sekunden', desc: 'Eine Karriereseite mit Kurzbewerbung am Handy. Gesellen, Azubis und Fachkräfte bewerben sich ohne Anschreiben, in einer Minute.' },
      { title: 'Gefunden, wenn Dresden sucht', desc: 'Eigene Seiten für Ihre Leistungen und Stadtteile, dazu ein sauber eingerichtetes Google-Unternehmensprofil.' },
    ],
  },
  voice: {
    eyebrow: 'In jedem Entwurf',
    title: 'Ihre Website nimmt Aufträge an. Per Sprache.',
    intro: 'Jeder Entwurf hat einen KI-Assistenten eingebaut. Kunden tippen auf „Auftrag per Sprache aufgeben“ und erzählen, worum es geht. Der Assistent stellt die Fragen, die Sie für ein Angebot brauchen, und legt Ihnen eine fertige Auftragskarte hin.',
    niches: [
      { label: 'Handwerk', title: 'Auftragsannahme', desc: 'Fragt nach Gewerk, Ort und Erreichbarkeit, markiert Dringendes und bittet um Fotos.' },
      { label: 'Praxen', title: 'KI-Rezeption', desc: 'Beantwortet Fragen zu Öffnungszeiten und Leistungen und notiert Terminwünsche.' },
      { label: 'Fahrzeug', title: 'Einbau-Anfrage', desc: 'Fragt Fahrzeug, Baujahr und Wunsch ab, damit Sie gleich ein Angebot machen können.' },
    ],
    rules: [
      'Sagt im ersten Satz, dass er eine KI ist',
      'Es wird kein Ton aufgezeichnet',
      'Nennt keine Preise, sagt keine Termine zu',
    ],
    note: 'Den Assistenten gibt es auf Wunsch auch für Ihre fertige Website.',
    // Gesprächsausschnitt und Auftragskarte: gestaltetes Beispiel, kein Live-Assistent auf dieser Seite
    demoLabel: 'Beispiel · Wendler Haustechnik',
    chat: [
      { who: 'ki', text: 'Hallo, hier ist die KI-Assistentin von Wendler Haustechnik. Worum geht es?' },
      { who: 'kunde', text: 'Unsere Heizung ist seit heute früh aus. Altbau, zweiter Stock.' },
      { who: 'ki', text: 'Das notiere ich als dringend. In welchem Stadtteil sind Sie?' },
    ],
    card: {
      number: 'Auftrag A-1042',
      badge: 'Dringend',
      rows: [
        ['Anliegen', 'Heizung ausgefallen'],
        ['Objekt', 'Altbau, 2. OG'],
        ['Ort', 'Dresden-Striesen'],
        ['Rückruf', 'heute bis 18 Uhr'],
        ['Fotos', 'Foto-Link erstellt'],
      ] as [string, string][],
    },
  },
  examples: {
    eyebrow: 'So sieht ein Entwurf aus',
    title: 'Drei Beispiel-Entwürfe.',
    text: 'Jede Branche bekommt ihren eigenen Stil. Ihr Entwurf zeigt Ihre Leistungen, Ihre Fotos und Ihr Team.',
    badge: 'Beispiel-Entwurf',
    items: [
      { title: 'Wendler Haustechnik', tag: 'Heizung & Sanitär · warm und kräftig', img: '/dresden/beispiel-shk' },
      { title: 'Physio am Lindenplatz', tag: 'Physiotherapie · hell und ruhig', img: '/dresden/beispiel-praxis' },
      { title: 'Elbklang Car-HiFi', tag: 'Car-HiFi & Nachrüstung · dunkel und präzise', img: '/dresden/beispiel-carhifi' },
    ],
  },
  process: {
    eyebrow: 'Ablauf',
    title: 'Vier Schritte bis online.',
    steps: [
      { title: 'Gespräch oder Besuch', desc: 'Sie erzählen, was die Website bringen soll: Aufträge, Patienten, Bewerber. Am Telefon oder bei Ihnen im Betrieb.' },
      { title: 'Kostenloser Entwurf', desc: 'Wir bauen Ihre neue Startseite aus Ihrer bisherigen Website, mit KI-Assistent. Sie klicken sie in Ruhe am Handy durch.' },
      { title: 'Angebot zum Festpreis', desc: 'Gefällt Ihnen der Entwurf, bekommen Sie ein festes Angebot. Sie entscheiden danach.' },
      { title: 'Live, mit Monatsbericht', desc: 'Ihre Website geht online. Danach sehen Sie jeden Monat, wie viele Anfragen und Bewerbungen darüber kamen.' },
    ],
  },
  pricing: {
    eyebrow: 'Preise',
    title: 'Festpreis, bevor es losgeht.',
    voice: 'KI-Assistent: auf Wunsch, Preis im Angebot',
    cta: 'Entwurf anfragen',
    more: 'Alle Preise im Detail →',
  },
  trust: {
    eyebrow: 'Wer dahintersteht',
    title: 'Eine deutsche GmbH. Ein Gesicht vor Ort.',
    facts: [
      { title: 'JPR Consulting GmbH', desc: 'JPR Studio ist eine Marke der JPR Consulting GmbH, Letteallee 91, 13409 Berlin.' },
      { title: 'Ihnen gehört die Website', desc: 'Sie bekommen Code, Domain und alle Zugänge. Kein Baukasten-Abo, keine Lizenzgebühren.' },
      { title: 'Ansprechpartner in Dresden', desc: 'Tom Nowak ist Ihr Kontakt vor Ort, vom ersten Gespräch bis zum Angebot.' },
    ],
    quotesLabel: 'Kundenstimmen von JPR Studio',
  },
  faq: {
    eyebrow: 'Fragen',
    title: 'Häufige Fragen.',
    items: [
      { q: 'Was kostet der Entwurf?', a: 'Nichts. Der Entwurf ist kostenlos. Gefällt er Ihnen, bekommen Sie ein Festpreis-Angebot für die fertige Website und entscheiden in Ruhe.' },
      { q: 'Ich habe keine Zeit für Website-Kram.', a: 'Wir bauen den Entwurf aus Ihrer bisherigen Seite. Texte, Bilder und Technik übernehmen wir. Von Ihnen brauchen wir ein kurzes Gespräch und Ihre Rückmeldung zum Entwurf.' },
      { q: 'Wie funktioniert der KI-Assistent?', a: 'Kunden sprechen direkt auf Ihrer Website mit dem Assistenten, im Browser. Er sagt zuerst, dass er eine KI ist, stellt die Fragen, die Sie für ein Angebot brauchen, und legt eine Auftragskarte an. Es wird kein Ton aufgezeichnet. Preise und Termine sagt er nie zu, das bleibt bei Ihnen.' },
      { q: 'Was kostet die Website?', a: 'Eine One-Page-Website beginnt bei 1.500 €, eine mehrseitige Website bei 3.000 €, ein Shop oder eine Web-App bei 5.000 €, jeweils netto. Nach dem kostenlosen Entwurf bekommen Sie einen Festpreis. Betreuung mit Hosting, Updates und Backups gibt es ab 49 € im Monat.' },
      { q: 'Ich habe noch gar keine Website.', a: 'Kein Problem. Dann sprechen Sie kurz mit Tom über Ihren Betrieb und bekommen ein Angebot für Ihre erste Website. Der kostenlose Entwurf vorab wird aus einer bestehenden Seite gebaut.' },
      { q: 'Wem gehört die Website am Ende?', a: 'Ihnen, vollständig. Sie bekommen Code, Domain und alle Zugänge. Betreuung ist möglich, aber kein Muss: Sie können die Seite jederzeit von jemand anderem weiterführen lassen.' },
      { q: 'Wer steckt hinter JPR Studio?', a: 'JPR Studio ist eine Marke der JPR Consulting GmbH mit Sitz in Berlin. In Dresden ist Tom Nowak Ihr Ansprechpartner, gebaut wird im Team von JPR Studio.' },
    ],
  },
  cta: {
    title: ['Erst sehen.', 'Dann entscheiden.'],
    text: 'Tragen Sie Ihre Website ein. Sie bekommen einen kostenlosen Entwurf mit KI-Assistent und entscheiden danach.',
    button: 'Kostenlosen Entwurf anfragen',
  },
  footer: { home: 'Startseite', pricing: 'Preise', imprint: 'Impressum', privacy: 'Datenschutz' },
  sticky: 'Kostenlosen Entwurf anfragen',
  draft,
};

export type DresdenCopy = typeof dresden;
