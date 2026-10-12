// Texte der Landingpage /website-fuer-handwerker (nur Deutsch, Ziel der Google-Ads-Suchkampagne).
// Wird von der Komponente (components/HandwerkPage.tsx) und vom Prerender (scripts/prerender.mjs)
// gelesen — sichtbarer Text, vorgerendertes HTML und FAQ-Schema bleiben so im selben Wortlaut.

export const handwerkPath = '/website-fuer-handwerker';

/** Block „Und danach: dein Büro läuft von selbst“ — nur Seiten, die ihn zeigen; sonst null. */
export type AutopilotCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  flowLabel: string;
  steps: { time: string; title: string; desc: string }[];
  moreLabel: string;
  more: { title: string; desc: string }[];
  note: string;
  cta: string;
};

export const handwerk = {
  theme: 'dark' as 'dark' | 'light',
  sourceTag: 'lp-handwerk',
  presetIndustry: 2,
  meta: {
    title: 'Website für Handwerker — mehr Anfragen, Festpreis ab 1.500 € | JPR Studio',
    desc: 'Websites für Handwerksbetriebe: bei Google gefunden, Anfrageformular mit Fotos, Referenzgalerie. Kostenloser Entwurf in 48 Stunden, Festpreis ab 1.500 €, alles gehört dir.',
  },
  nav: { cta: 'Kostenlosen Entwurf anfragen →', ctaShort: 'Entwurf anfragen →', all: 'Alle Leistungen' },
  hero: {
    topLeft: 'Websites für Handwerksbetriebe — deutschlandweit',
    topRight: 'Festpreis · Entwurf kostenlos',
    h1: ['Website für', 'Handwerker,', 'die Aufträge bringt.'],
    img: { base: '/handwerk/elektriker', flip: true, pos: 'object-[35%_20%] lg:object-center' },
    imgAlt: 'Elektriker in einem Neubau-Raum mit Kabeln und Leiter, der lächelnd auf sein Smartphone schaut',
    audience: 'Für Elektriker, SHK, Maler, Dachdecker, Tischler, Fliesenleger und alle anderen Gewerke.',
    formTitle: 'Kostenloser Entwurf in 48 Stunden',
    offer: 'Trag deine Website ein. Wir schicken dir einen anklickbaren Entwurf deiner neuen Seite. Danach entscheidest du, Festpreis ab 1.500 €.',
    cta: 'Kostenlosen Entwurf anfragen →',
    proofs: ['Entwurf in 48 Stunden', 'Festpreis vor Projektstart', 'Kein Abo, kein Lock-in', 'Du musst keine Texte schreiben'],
  },
  trades: {
    ariaLabel: 'Gewerke',
    label: 'Für jedes Gewerk',
    items: ['Elektriker', 'SHK', 'Maler', 'Dachdecker', 'Tischler', 'Fliesenleger', 'Zimmerei', 'Metallbau', 'Gartenbau', 'Trockenbau'],
  },
  problem: {
    eyebrow: '[01] — Kennst du das?',
    title: 'Gute Arbeit. Falsche Anfragen.',
    items: [
      { title: 'Das Handy klingelt auf der Baustelle', desc: 'Jede Anfrage ist ein Anruf, mitten in der Arbeit. Und die Hälfte will nur wissen, ob du „auch mal kurz“ vorbeikommen kannst.' },
      { title: 'Anfragen ohne jede Info', desc: '„Was kostet ein neues Bad?“ — ohne Maße, ohne Fotos, ohne Ort. Du telefonierst hinterher, statt gleich ein Angebot zu schreiben.' },
      { title: 'Die Website ist von 2015', desc: 'Am Handy unlesbar, keine Referenzen, kein Formular. Kunden vergleichen drei Betriebe — und rufen den an, der professionell aussieht.' },
      { title: 'Portale kosten pro Anfrage', desc: 'Auf Vermittlungsportalen zahlst du für jeden Kontakt und bietest gegen fünf andere. Über die eigene Website kommt die Anfrage direkt zu dir.' },
    ],
  },
  features: {
    eyebrow: '[02] — Was deine neue Website kann',
    title: 'Gebaut für Betriebe.',
    items: [
      { title: 'Anfrage mit Fotos', desc: 'Kunden wählen die Leistung, laden Fotos hoch und geben ihre PLZ an. Du bekommst eine vollständige Anfrage per Mail — und rufst nur zurück, wenn es passt.' },
      { title: 'Deine Arbeit im Schaufenster', desc: 'Referenzen und Vorher-Nachher-Bilder, sortiert nach Leistung. Handyfotos reichen — wir bereiten sie auf.' },
      { title: 'Bei Google in deiner Region', desc: 'Eigene Seiten für deine Leistungen und dein Einzugsgebiet, sauber eingerichtetes Google-Unternehmensprofil. So findet man dich, wenn man „Elektriker + Ort“ sucht.' },
      { title: 'Auch für Bewerber', desc: 'Eine Karriereseite, die Gesellen und Azubis zeigt, warum sie bei dir arbeiten sollen — mit Kurzbewerbung in zwei Minuten.' },
    ],
  },
  autopilot: {
    eyebrow: '[03] — Und danach',
    title: 'Dein Büro läuft von selbst.',
    intro: 'Die Website holt die Anfrage. Was danach kommt, kostet dich heute die Abende am Schreibtisch. Das bauen wir dir dazu, passend zu deinem Betrieb.',
    flowLabel: 'Beispiel: eine Badsanierung in Leipzig',
    steps: [
      { time: 'Mo 07:12', title: 'Die Anfrage kommt rein', desc: 'Der Kunde wählt „Bad sanieren“, lädt drei Fotos hoch und gibt seine PLZ an. Er bekommt sofort eine Bestätigung.' },
      { time: 'Mo 07:13', title: 'Das Angebot ist vorgeschrieben', desc: 'Aus Anfrage, Fotos und deinen Preisen entsteht ein Angebotsentwurf. Du prüfst, änderst und schickst ab.' },
      { time: 'Do 18:00', title: 'Der Kunde wird erinnert', desc: 'Keine Antwort aufs Angebot? Nach drei Tagen geht eine freundliche Nachfrage raus, in deinem Namen.' },
      { time: 'Nach dem Auftrag', title: 'Die Bewertung wird angefragt', desc: 'Der Kunde bekommt einen Link zu deinem Google-Profil. Mehr Sterne bringen mehr Anfragen.' },
    ],
    moreLabel: 'Und mehr, je nachdem, was du brauchst',
    more: [
      { title: 'Belege sortieren sich', desc: 'Rechnungen aus dem Postfach landen geordnet beim Steuerberater, ohne Abtippen.' },
      { title: 'Morgens ein Bericht aufs Handy', desc: 'Offene Anfragen, ausstehende Angebote, unbezahlte Rechnungen. Alles auf einen Blick.' },
      { title: 'Deine eigene Software', desc: 'Aufträge, Kundenkartei, Terminplan: so gebaut, wie dein Betrieb arbeitet, nicht umgekehrt.' },
    ],
    note: 'Wir schauen uns an, wie dein Betrieb heute arbeitet, und bauen genau die Teile, die dir Zeit sparen. Festpreis vorher, wie bei der Website.',
    cta: 'Erzähl mir, was dich Zeit kostet →',
  } as AutopilotCopy | null,
  reference: {
    eyebrow: '[04] — So sieht dein Entwurf aus',
    title: 'Drei Beispiel-Entwürfe.',
    text: 'So sieht ein Entwurf aus, wie du ihn nach 48 Stunden bekommst. Deiner zeigt deine Leistungen, deine Baustellen und dein Team.',
    // Echte Referenz unter den Beispiel-Entwürfen (leer = keine)
    realText: 'RopeFX führt Höhenarbeiten und Industrieklettern in Berlin aus. Wir haben Website und Anfrage-Strecke gebaut: Leistungen auf einen Blick, Referenzen, und ein Formular, das die wichtigsten Infos zum Auftrag gleich mit abfragt.',
    href: 'https://ropefx.com',
    url: 'ropefx.com',
    img: '/portfolio-shots/ropefx.jpg',
    alt: 'Screenshot der Website ropefx.com',
    link: 'ropefx.com ansehen →',
    moreLabel: 'Aus der Praxis',
    exclude: 'RopeFX',
    // Beispiel-Entwürfe statt echter Referenz (z. B. Praxis); leer = echte Referenz + weitere Projekte
    demos: [
      { title: 'Bad & Wärme Krüger', tag: 'SHK · klar und vertrauensvoll', img: '/handwerk/demo-shk.jpg', alt: 'Beispiel-Entwurf der Website eines SHK-Betriebs mit Anfrageformular für Fotos' },
      { title: 'Malerei Hoffmann', tag: 'Maler · warm und hochwertig', img: '/handwerk/demo-maler.jpg', alt: 'Beispiel-Entwurf der Website eines Malerbetriebs' },
      { title: 'Dachtechnik Brandt', tag: 'Dachdecker · kräftig und direkt', img: '/handwerk/demo-dach.jpg', alt: 'Beispiel-Entwurf der Website eines Dachdeckerbetriebs' },
    ] as { title: string; tag: string; img: string; alt: string }[],
    demoBadge: 'Beispiel-Entwurf',
  },
  process: {
    eyebrow: '[05] — Ablauf',
    title: 'In drei Schritten online.',
    steps: [
      { title: 'Website eintragen', desc: '2 Minuten, 4 kurze Fragen, ganz ohne Termin. Keine Website? Auch kein Problem.' },
      { title: 'Entwurf in 48 Stunden', desc: 'Du bekommst einen anklickbaren Entwurf per Mail — schau ihn dir abends in Ruhe am Handy an.' },
      { title: 'Festpreis & Launch', desc: 'Gefällt er dir, bekommst du einen Festpreis. Texte schreiben wir, du gibst nur Feedback. In 1–2 Wochen bist du online.' },
    ],
  },
  pricingEyebrow: 'Preise — Festpreis vor Start',
  faq: {
    eyebrow: '[06] — FAQ',
    title: 'Fragen von Handwerkern.',
    items: [
      { q: 'Ich hab keine Zeit für Website-Kram.', a: 'Musst du auch nicht. Du trägst deine Website ein und beantwortest 4 Fragen. Texte, Bilder und Technik übernehmen wir. Insgesamt brauchst du vielleicht eine Stunde — verteilt auf ein paar Rückmeldungen per Mail oder Telefon.' },
      { q: 'Ich habe keine guten Fotos.', a: 'Handyfotos von deinen Baustellen reichen völlig. Wir wählen aus, schneiden zu und bearbeiten sie. Fehlt etwas, nutzen wir passende Bilder, bis du eigene hast.' },
      { q: 'Lohnt sich das, ich habe doch genug Arbeit?', a: 'Gerade dann. Wer genug Anfragen hat, kann sich die besseren Aufträge aussuchen — in deinem Gebiet, zu deinen Preisen. Und eine gute Website hilft auch beim Finden von Personal.' },
      { q: 'Geht das auch ohne neue Website?', a: 'Ja. Angebotsentwurf, Nachfassen oder Belege lassen sich auch an deine bestehende Seite und dein Postfach anschließen. Wir schauen zuerst, was du schon nutzt.' },
      { q: 'Was ist mit Vermittlungsportalen?', a: 'Portale können ein Zusatz sein. Aber dort zahlst du pro Kontakt und stehst im direkten Preisvergleich. Anfragen über deine eigene Website kosten dich nichts extra und kommen nur zu dir.' },
      { q: 'Was kostet die Website?', a: 'Eine One-Page-Website beginnt bei 1.500 €, eine mehrseitige Website mit Anfrageformular und Referenzen bei 3.000 € — jeweils netto. Nach dem kostenlosen Entwurf bekommst du einen Festpreis.' },
      { q: 'Wem gehört die Website am Ende?', a: 'Dir — vollständig. Du bekommst Code, Domain und alle Zugänge. Kein Baukasten-Abo, keine Lizenzgebühren. Betreuung ab 49 €/Monat ist möglich, aber kein Muss.' },
      { q: 'Arbeitet ihr auch außerhalb von Berlin?', a: 'Ja, deutschlandweit. Alles läuft online: Entwurf per Link, Abstimmung per Telefon, Video oder Mail.' },
    ],
  },
  cta: {
    title: ['Mehr Aufträge,', 'weniger Telefon.'],
    text: 'Trag deine Website ein — in 48 Stunden hast du einen kostenlosen Entwurf im Postfach.',
    button: 'Kostenlosen Entwurf anfragen →',
    call: 'Lieber erst sprechen? 30 Minuten per Video →',
  },
  about: { eyebrow: 'Dein Ansprechpartner', fact: 'Du sprichst direkt mit dem, der baut' },
  footer: { home: 'Startseite', pricing: 'Preise', blog: 'Blog' },
  sticky: 'Kostenlosen Entwurf anfragen →',
};

/** Gemeinsame Form aller Branchen-Landingpages (Handwerk, Praxis, …). */
export type LandingCopy = typeof handwerk;
