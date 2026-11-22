// Texte der Landingpage /dresden (nur Deutsch, Sie-Form): Toms Seite für Betriebe in Dresden.
// Die Dresden-Unit läuft unter der JPR Consulting GmbH (Entscheidung Jan, 02.11.2026).
// Komponente (components/DresdenPage.tsx) und Prerender (scripts/prerender.mjs) lesen dieselbe Quelle.
// Preise kommen bewusst aus site-copy.ts (copy.de.pricing), damit sie überall gleich bleiben.

import { copy, type SiteCopy } from './site-copy';

// Toms Seite liegt seit 13.11.2026 unter /tom-nowak (Jan); /dresden und /tom.nowak leitet vercel.json dauerhaft hierher um.
// Die Bilder bleiben unter /dresden/*, damit bestehende Bild-Adressen weiter funktionieren.
export const dresdenPath = '/tom-nowak';

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
  // v3 (22.11.2026): Texte aus tom-v3/copy-final.md (Texter-Agent). Reihenfolge der Seite:
  // Hero · Zahlenleiste · Vorher/Nachher · Ergebnisse · KI-Assistent · Beispiel-Entwürfe · Kundenprojekt · Kundenstimmen · Tom · Ablauf · Preise · FAQ · Schluss
  meta: {
    title: 'Webdesign Dresden: Entwurf in 48 Stunden gratis | JPR Studio',
    desc: 'Website für Handwerk, Praxen und Car-HiFi in Dresden. Den Entwurf sehen Sie vor dem Bezahlen: in 48 Stunden, mit KI-Assistent. Festpreis ab 1.500 € netto.',
  },
  nav: { place: 'Dresden', cta: 'Entwurf anfragen' },
  hero: {
    eyebrow: 'Für Handwerk, Praxen und Car-HiFi in Dresden',
    // H1 in drei Teilen: der mittlere wird kursiv im Akzent gesetzt
    h1: ['Sie sehen Ihre neue Website,', 'bevor', 'Sie einen Euro bezahlen.'],
    sub: 'Eine Website, über die Kunden anfragen und Bewerber sich melden. Den Entwurf bauen wir in 48 Stunden aus Ihrer jetzigen Seite. Kostenlos.',
    cta: 'Kostenlosen Entwurf anfragen',
    secondary: 'Beispiel-Entwürfe ansehen',
    proofs: ['Festpreis ab 1.500 € netto', 'KI-Assistent in jedem Entwurf', 'JPR Consulting GmbH, Berlin'],
    // Tom-Minikarte unter den Knöpfen: Avatar + zwei Zeilen + Mail-Link
    tomCard: { name: 'Tom Nowak', role: 'Ihr Ansprechpartner in Dresden', link: 'E-Mail an Tom' },
    deviceAlt: 'Beispiel-Entwurf einer Website für einen Car-HiFi-Betrieb auf dem Rechner und für einen Heizungsbauer auf dem Handy',
  },
  // Laufband unter der Zahlenleiste: die Branchen aus der bisherigen Seite (kein neuer Text)
  audience: {
    label: 'Branchen',
    items: ['Handwerk', 'Praxen & Therapie', 'Fahrzeug-Ausstattung & Car-HiFi'],
  },
  strip: {
    items: [
      { value: '48 h', label: 'bis Ihr Entwurf da ist' },
      { value: '0 €', label: 'bis Sie Ja sagen' },
      { value: '206', label: 'Personen zum Probetraining angemeldet, bei einem Kunden*' },
      { value: '100 %', label: 'Code, Domain und Zugänge gehören Ihnen' },
    ],
    footnote: '* Kampfsportverein in Berlin, online angemeldet seit März 2026, ohne Werbebudget.',
  },
  beforeAfter: {
    eyebrow: 'Vorher / Nachher',
    title: 'Der Kunde hat Sie gefunden. Und dann?',
    intro: 'Wir haben Websites von Handwerksbetrieben in Dresden geprüft. Vier Dinge fehlen besonders oft. So sieht es auf Ihrer neuen Website aus.',
    colBefore: 'Heute oft',
    colAfter: 'Mit Ihrer neuen Website',
    // Regler-Beschriftung (Jan, 22.11.2026) und Name der Attrappe (erfunden, kein echter Betrieb)
    sliderBefore: 'Ihre Seite heute',
    sliderAfter: 'Ihr Entwurf',
    mockName: 'Mustermann Haustechnik',
    pairs: [
      {
        label: 'Telefon',
        before: 'Die Nummer steht da, aber am Handy lässt sie sich nicht antippen. Wer anrufen will, muss sie abschreiben.',
        after: 'Ein Tipp auf die Nummer, und bei Ihnen klingelt es.',
        stat: '33 von 46 geprüften Seiten',
      },
      {
        label: 'Anfrage',
        before: 'Kein Anfrageformular. Wer lieber schreibt als anruft, muss selbst eine Mail aufsetzen.',
        after: 'Ein Anfrageformular, direkt am Handy. Auch abends, auch sonntags.',
        stat: '23 von 46 geprüften Seiten',
      },
      {
        label: 'Bewerbung',
        before: 'Keine Seite für Bewerber. Ein Geselle, der wechseln will, sieht nicht, dass Sie suchen.',
        after: 'Eine Karriereseite, die zeigt, wen Sie suchen. Bewerben geht direkt am Handy.',
        stat: '37 von 46 geprüften Seiten',
      },
      {
        // Ersatzpaar „Arbeiten“ aus dem Deck (Jan, 22.11.2026): Referenzen fehlten bei 30 von 46
        label: 'Arbeiten',
        before: 'Keine Referenzen. Besucher sehen nicht, was Sie schon gebaut haben.',
        after: 'Ihre Arbeiten als Bilder, sortiert nach Leistung. Handyfotos reichen.',
        stat: '30 von 46 geprüften Seiten',
      },
    ],
    footnote: 'Eigene Prüfung im November 2026: 46 erreichbare Websites Dresdner Handwerksbetriebe, automatisch geprüft.',
  },
  outcomes: {
    eyebrow: 'Ergebnis',
    title: 'Was bei Ihnen ankommt.',
    items: [
      { title: 'Anfragen, mit denen Sie arbeiten können', desc: 'Kunden wählen die Leistung, laden Fotos hoch und nennen ihren Stadtteil. Sie lesen die Anfrage und wissen, ob sich der Rückruf lohnt.' },
      { title: 'Bewerbungen in 60 Sekunden', desc: 'Gesellen, Azubis und Fachkräfte bewerben sich am Handy, ohne Anschreiben.' },
      { title: 'Kunden aus Ihrem Stadtteil', desc: 'Eigene Seiten für Ihre Leistungen und Stadtteile, dazu ein sauber eingerichtetes Google-Unternehmensprofil. Damit man Sie findet, wenn in Dresden jemand sucht.' },
    ],
  },
  voice: {
    eyebrow: 'KI-Assistent · in jedem Entwurf',
    title: 'Ihre Website nimmt Aufträge an. Per Sprache.',
    intro: 'Ihre Kunden erzählen, worum es geht. Der Assistent fragt nach, was Sie für ein Angebot brauchen. Sie bekommen eine fertige Auftragskarte.',
    niches: [
      { label: 'Handwerk', title: 'Auftragsannahme', desc: 'Fragt nach Gewerk, Ort und Erreichbarkeit, markiert Dringendes und bittet um Fotos.' },
      { label: 'Praxen', title: 'KI-Rezeption', desc: 'Beantwortet Fragen zu Öffnungszeiten und Leistungen und notiert Terminwünsche.' },
      { label: 'Fahrzeug', title: 'Einbau-Anfrage', desc: 'Fragt Fahrzeug, Baujahr und Wunsch ab, damit Sie gleich ein Angebot machen können.' },
    ],
    rules: [
      'Sagt im ersten Satz, dass er eine KI ist',
      'Nimmt keinen Ton auf',
      'Preise und Termine sagen Sie zu, nicht die KI',
    ],
    note: 'Für Ihre fertige Website gibt es den Assistenten auf Wunsch dazu. Den Preis sehen Sie im Angebot.',
    // Gesprächsausschnitt und Auftragskarte: gestaltetes Beispiel, kein Live-Assistent auf dieser Seite
    demoTitle: 'Auftrag per Sprache aufgeben',
    demoLabel: 'Beispiel · Wendler Haustechnik',
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
    eyebrow: 'So sieht ein Entwurf aus',
    title: 'Drei Branchen. Drei Entwürfe.',
    text: 'Die Betriebe sind erfunden, die Entwürfe sind echt gebaut. Ihr Entwurf zeigt Ihre Leistungen und Ihre Fotos.',
    badge: 'Beispiel-Entwurf',
    items: [
      { title: 'Wendler Haustechnik', tag: 'Heizung & Sanitär · warm und kräftig', img: '/dresden/beispiel-shk' },
      { title: 'Physio am Lindenplatz', tag: 'Physiotherapie · hell und ruhig', img: '/dresden/beispiel-praxis' },
      { title: 'Elbklang Car-HiFi', tag: 'Car-HiFi & Nachrüstung · dunkel und präzise', img: '/dresden/beispiel-carhifi' },
    ],
  },
  // Kundenprojekt (White-Label: kein Name, keine URL, kein Logo)
  caseStudy: {
    kicker: 'Kundenprojekt · Kampfsportverein in Berlin',
    count: 206,
    countLabel: 'Personen haben sich online zum Probetraining angemeldet',
    countNote: 'seit März 2026',
    title: 'Ohne einen Euro Werbung.',
    old: 'Vorher: ein Vereins-Blog mit News. Aber kein Weg zum Probetraining.',
    now: 'Heute: ein roter Knopf. Probetraining online buchen, Trainingsplan gleich dabei.',
    bridge: 'Anderes Geschäft, gleicher Moment: Jemand will loslegen. Bei Ihnen heißt der Knopf „Anfrage senden“ oder „Termin buchen“.',
    cta: 'Kostenlosen Entwurf anfragen',
  },
  testimonials: {
    eyebrow: 'Kundenstimmen',
    title: 'Das sagen Kunden von JPR Studio.',
    // Wortlaut unverändert aus copy.de.testimonials.items, ohne Namen, Firma und Logo
    quotes: [
      { quote: copy.de.testimonials.items[1].quote, who: 'Kampfsportverein, Berlin' },
      { quote: copy.de.testimonials.items[0].quote, who: 'Industriekletter-Betrieb, Berlin' },
    ],
    note: 'Wortlaut unverändert.',
  },
  tom: {
    initials: 'TN',
    name: 'Tom Nowak',
    role: 'Ihr Ansprechpartner in Dresden',
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
    eyebrow: 'Persönlich vor Ort',
    title: 'Den Entwurf zeigt Ihnen Tom. Gern bei Ihnen im Betrieb.',
    text: 'Tom Nowak ist Ihr Ansprechpartner in Dresden, vom ersten Gespräch bis zum Angebot. Er klickt den Entwurf mit Ihnen am Handy durch und klärt, was die Seite können soll. Gebaut wird im Team von JPR Studio, zum Festpreis und mit festem Ablauf.',
    // TODO(Jan/Tom): optional ein Satz von Tom in eigenen Worten, nur wenn er ihn freigibt. Leer = ausgeblendet.
    personal: '',
    company: 'JPR Studio ist eine Marke der JPR Consulting GmbH, Letteallee 91, 13409 Berlin.',
    cta: 'Entwurf anfragen',
  },
  process: {
    eyebrow: 'Ablauf',
    title: 'Vier Schritte bis online.',
    steps: [
      { title: 'Website eintragen', desc: 'Die Adresse Ihrer jetzigen Seite und vier kurze Fragen. Dauert zwei Minuten.' },
      { title: 'Entwurf in 48 Stunden', desc: 'Ihre neue Startseite, gebaut aus Ihrer jetzigen, mit KI-Assistent. Sie klicken sie in Ruhe am Handy durch.' },
      { title: 'Gespräch und Festpreis', desc: 'Tom bespricht den Entwurf mit Ihnen, am Telefon oder bei Ihnen im Betrieb. Gefällt er Ihnen, bekommen Sie ein Angebot zum Festpreis.' },
      // Kein Monatsbericht (Jan, 22.11.2026): Schritt 4 ohne Berichtszusage
      { title: 'Live', desc: 'Ihre Website geht online. Code, Domain und alle Zugänge gehören Ihnen.' },
    ],
  },
  pricing: {
    eyebrow: 'Preise',
    title: 'Festpreis, bevor es losgeht.',
    reco: 'Empfohlen',
    tiers: [
      {
        name: 'Starter', price: 'ab 1.500 €', reco: false,
        for: 'Eine Seite, schnell online: für Betriebe, die vor allem angerufen werden wollen.',
        features: ['One-Page-Website', 'Fürs Handy gebaut', 'Kontaktformular', 'Google Maps eingebunden', 'Grundlagen für Google (Basis-SEO)', '1 Korrekturschleife'],
      },
      {
        name: 'Professional', price: 'ab 3.000 €', reco: true,
        for: 'Für Betriebe und Praxen mit mehreren Leistungen, einem Team und Online-Terminen.',
        features: ['Mehrseitige Website', 'Online-Terminbuchung', 'Seiten für Team, Leistungen und Galerie', 'Erweiterte Optimierung für Google (SEO)', 'Besucherzahlen mit Google Analytics', '3 Korrekturschleifen, Einführung und Support'],
      },
      {
        name: 'Business', price: 'ab 5.000 €', reco: false,
        for: 'Für Betriebe, die online verkaufen oder Abläufe automatisieren wollen.',
        features: ['Alles aus Professional', 'Online-Shop oder Web-App', 'Kundenverwaltung', 'Eigene Funktionen und Automatisierungen', 'Laufender Support', 'Unbegrenzte Korrekturen'],
      },
    ],
    care: 'Betreuung ab 49 €/Monat: Hosting, Updates, Backups, Support',
    voice: 'KI-Assistent für die fertige Website: auf Wunsch, Preis im Angebot',
    note: 'Alle Preise netto zzgl. MwSt.',
    cta: 'Kostenlosen Entwurf anfragen',
  },
  faq: {
    eyebrow: 'Fragen',
    title: 'Häufige Fragen.',
    items: [
      { q: 'Was kostet das?', a: 'Der Entwurf: nichts. Die fertige Website: ab 1.500 € als One-Page, ab 3.000 € mehrseitig mit Online-Terminen, ab 5.000 € mit Shop oder Web-App, jeweils netto. Nach dem Entwurf bekommen Sie einen Festpreis und entscheiden dann.' },
      { q: 'Wie schnell ist die Website online?', a: 'Den Entwurf haben Sie nach 48 Stunden. Die fertige Website: einfache Seiten in wenigen Tagen, mit Shop oder Extras in ein bis zwei Wochen.' },
      { q: 'Ich habe keine Zeit für Website-Kram.', a: 'Wir bauen den Entwurf aus Ihrer jetzigen Seite. Texte, Bilder und Technik übernehmen wir. Von Ihnen brauchen wir ein kurzes Gespräch und Ihre Rückmeldung zum Entwurf.' },
      { q: 'Was macht der KI-Assistent genau?', a: 'Ihre Kunden sprechen im Browser mit ihm. Er sagt zuerst, dass er eine KI ist, stellt Ihre Fragen für ein Angebot und legt eine Auftragskarte an. Ton nimmt er nicht auf. Preise und Termine sagen Sie zu, nicht er.' },
      { q: 'Ich habe noch gar keine Website.', a: 'Dann schreiben Sie Tom an tom@workwithjpr.com. Er spricht mit Ihnen über Ihren Betrieb, am Telefon oder bei Ihnen vor Ort. Danach bekommen Sie ein Angebot für Ihre erste Website. Den kostenlosen Entwurf vorab bauen wir aus einer bestehenden Seite.' },
      { q: 'Wem gehört die Website am Ende?', a: 'Ihnen, vollständig: Code, Domain und alle Zugänge. Betreuung bei uns buchen Sie dazu, wenn Sie wollen. Weiterführen kann die Seite jederzeit auch jemand anderes.' },
      { q: 'Wer baut die Website?', a: 'Das Team von JPR Studio, einer Marke der JPR Consulting GmbH mit Sitz in Berlin. Tom Nowak ist Ihr Ansprechpartner in Dresden, vom ersten Gespräch bis zum Angebot. Sie erreichen ihn unter tom@workwithjpr.com.' },
    ],
  },
  cta: {
    title: ['Erst sehen.', 'Dann entscheiden.'],
    text: 'Tragen Sie Ihre Website ein. In 48 Stunden haben Sie Ihren Entwurf im Postfach, mit KI-Assistent.',
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
