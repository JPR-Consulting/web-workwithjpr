// Alle Texte der Startseite und der Preisseite, Deutsch und Englisch.
// Wird von der App (über useCopy) und vom Prerender (scripts/prerender.mjs)
// gelesen — so stehen sichtbarer Text, vorgerendertes HTML und FAQ-Schema
// garantiert im selben Wortlaut.
// Blog, Impressum und Datenschutz gibt es nur auf Deutsch.

export type Lang = 'de' | 'en';

export interface Project { url: string; href: string; title: string; tag: string; img: string }
export interface Tier { name: string; for: string; price: string; reco: boolean; features: string[] }
export interface Faq { q: string; a: string }
export interface Testimonial { quote: string; logo: string; name: string; company: string }

const de = {
  meta: {
    homeTitle: 'Webdesign Berlin — Moderne Websites für lokale Unternehmen | JPR Consulting',
    homeDesc: 'Websites mit Online-Terminbuchung für Gyms, Praxen und Handwerk — aus Berlin, für ganz Deutschland. Faire Preise ab 1.500 €, der Code gehört dir. Erster Entwurf kostenlos.',
    pricingTitle: 'Webdesign Preise Berlin 2026 — Website ab 1.500 € | JPR Consulting',
    pricingDesc: 'Transparente Preisliste: One-Page Website ab 1.500 €, Website mit Terminbuchung ab 3.000 €, Shop oder Web-App ab 5.000 €. Festes Angebot im kostenlosen Erstgespräch.',
  },
  nav: {
    links: [
      { label: '[01] Leistungen', id: 'leistungen' },
      { label: '[02] Projekte', id: 'projekte' },
      { label: '[03] Prozess', id: 'prozess' },
      { label: '[04] Preise', id: 'preise' },
      { label: '[05] FAQ', id: 'faq' },
    ],
    cta: 'Entwurf anfragen →',
    stickyCta: 'Entwurf anfragen',
    switchTo: 'Switch to English',
  },
  hero: {
    topLeft: 'Webdesign aus Berlin — für ganz Deutschland',
    topRight: 'Dir gehört der Code — kein Lock-in',
    h1: ['Websites,', 'die Kunden', 'bringen.'],
    audience: 'Für Gyms, Praxen, Handwerk und lokale Unternehmen.',
    offer: 'Erster Entwurf kostenlos — du siehst vorab, was du bekommst. Festpreis ab 1.500 €.',
    ctaPrimary: 'Jetzt kostenlosen Entwurf anfragen →',
    ctaSecondary: 'Preise ansehen',
    proofs: ['Live in Tagen statt Monaten', 'Festpreis vor Projektstart', 'Erster Entwurf kostenlos', 'Deutschlandweit, alles läuft online'],
    capacity: 'Aktuell freie Kapazitäten — Projekt noch diesen Monat starten.',
  },
  refs: {
    ariaLabel: 'Referenzen',
    label: 'Kunden & Projekte',
    items: [
      { name: 'Kampfwerk', what: 'Software für Kampfsportschulen' },
      { name: 'Muay Thai Subyen', what: 'Kampfsportschule' },
      { name: 'Gamerfunnel', what: 'Spielbare Werbe-Funnels' },
      { name: 'Nomads Digital', what: 'Games-Marketing' },
      { name: 'RopeFX', what: 'Höhenarbeiten' },
    ],
  },
  services: {
    eyebrow: '[01] — Leistungen',
    title: 'Alles aus einer Hand.',
    items: [
      { title: 'Moderne Website', desc: 'Mobil optimiert, schnell, wird bei Google gefunden. Der Code gehört dir — kein Baukasten-Abo.' },
      { title: 'Online-Terminbuchung', desc: 'Deine Kunden buchen direkt online — Tag und Nacht, ohne Telefon.' },
      { title: 'Shop & Web-Apps', desc: 'Zahlungsabwicklung, Kundenverwaltung, individuelle Funktionen.' },
      { title: 'KI-Automatisierung', desc: 'Prozesse automatisieren — vom Angebot bis zur Rechnung.' },
    ],
  },
  projects: {
    eyebrow: '[02] — Ausgewählte Projekte',
    title: 'Aktuelle Projekte.',
    scrollHint: 'Weiterscrollen ↓',
    swipeHint: 'Wischen →',
    altPrefix: 'Website von',
    items: [
      { url: 'kampfwerk.com', href: 'https://kampfwerk.com', title: 'Kampfwerk', tag: 'Software für Kampfsportschulen', img: '/portfolio-shots/kampfwerk.jpg' },
      { url: 'muaythai-subyen.de', href: 'https://www.muaythai-subyen.de', title: 'Muay Thai Subyen', tag: 'Gym-Website / Online-Mitgliedschaft', img: '/portfolio-shots/subyen.jpg' },
      { url: 'gamerfunnel.com', href: 'https://gamerfunnel.com', title: 'Gamerfunnel', tag: 'Spielbare Werbe-Funnels', img: '/portfolio-shots/gamerfunnel.jpg' },
      { url: 'nomadsdigital.com', href: 'https://www.nomadsdigital.com', title: 'Nomads Digital', tag: 'Marketing für Games / Website', img: '/portfolio-shots/nomads.jpg' },
      { url: 'ropefx.com', href: 'https://ropefx.com', title: 'RopeFX', tag: 'Website / Anfragen-Funnel', img: '/portfolio-shots/ropefx.jpg' },
    ] as Project[],
  },
  testimonials: {
    eyebrow: 'Kundenstimmen',
    title: 'Das sagen unsere Kunden.',
    note: '',
    reviewCta: 'Auch zufrieden? Bewertung auf Google hinterlassen →',
    items: [
      {
        quote: 'Die Website stand innerhalb weniger Tage. Seitdem bekommen wir regelmäßig Anfragen darüber — und sie sieht richtig professionell aus. Unkompliziert und auf den Punkt.',
        logo: '/logos/ropefx.webp',
        name: 'Michael Nüske',
        company: 'RopeFX — Industriekletterer Berlin',
      },
      {
        quote: 'Innerhalb einer Woche hatten wir eine komplette Website mit Trainingsplan, Mitgliederverwaltung und Online-Vertragsabschluss. Das hätte ich so schnell nicht erwartet.',
        logo: '/logos/muay-thai-subyen.webp',
        name: 'Sven Markulla',
        company: 'Muay Thai Subyen e.V.',
      },
    ] as Testimonial[],
  },
  process: {
    eyebrow: '[03] — Prozess',
    title: "So funktioniert's.",
    steps: [
      { title: 'Kostenloses Erstgespräch', desc: 'Wir besprechen dein Geschäft, deine Ziele und was du brauchst. 30 Minuten, unverbindlich.' },
      { title: 'Kostenloser Entwurf', desc: "Du bekommst einen ersten Entwurf deiner Website — komplett kostenlos. Erst wenn du zufrieden bist, geht's weiter." },
      { title: 'Umsetzung & Launch', desc: 'Wir bauen, du gibst Feedback, wir gehen live. Du bekommst eine Einführung und laufenden Support.' },
    ],
  },
  about: {
    eyebrow: 'Dein Ansprechpartner',
    photoAlt: 'Jan Rojek, Gründer von JPR Studio',
    badge: 'Berlin / Gründer',
    hello: 'Hi, ich bin',
    name: 'Jan.',
    paragraphs: [
      'Seit über 7 Jahren baue ich Websites und digitale Lösungen — von Websites für lokale Unternehmen bis zu Automatisierungssystemen für internationale Firmen.',
      'Was mich antreibt: Wenn ein Handwerker plötzlich über seine Website Anfragen bekommt. Oder eine Praxis ihre Terminbuchung online hat und das Telefon nicht mehr ständig klingelt.',
    ],
    highlight: 'Ich spreche deine Sprache — nicht die von Entwicklern. Du sagst mir, was dein Business braucht, und ich baue es.',
    facts: ['7+ Jahre Webentwicklung', 'Du sprichst direkt mit dem, der baut'],
  },
  pricing: {
    eyebrow: '[04] — Preise / Festpreis vor Start',
    pageEyebrow: 'Preise',
    title: 'Transparent. Ohne Tagessätze.',
    reco: '✦ Empfohlen',
    cta: 'Entwurf anfragen',
    note: 'Alle Preise netto zzgl. MwSt. · Ratenzahlung möglich · Betreuung ab 49 €/Monat (Hosting, Updates, Backups, Support)',
    detailsLink: 'Alle Webdesign-Preise in Berlin im Detail →',
    tiers: [
      { name: 'Starter', for: 'Für den Start', price: 'ab 1.500 €', reco: false, features: ['One-Page Website', 'Mobil optimiert', 'Kontaktformular', 'Google Maps Einbindung', 'Basis-SEO', '1 Korrekturschleife'] },
      { name: 'Professional', for: 'Unser beliebtestes Paket', price: 'ab 3.000 €', reco: true, features: ['Mehrseitige Website', 'Online-Terminbuchung', 'Team- & Leistungsseiten', 'Erweiterte SEO-Optimierung', 'Google Analytics', 'Galerie / Portfolio', '3 Korrekturschleifen', 'Einführung & Support'] },
      { name: 'Business', for: 'Für anspruchsvolle Projekte', price: 'ab 5.000 €', reco: false, features: ['Alles aus Professional', 'Online-Shop oder Web-App', 'Kundenverwaltung / Backend', 'Individuelle Funktionen', 'Automatisierungen', 'Laufender Support', 'Unbegrenzte Korrekturen'] },
    ] as Tier[],
  },
  faq: {
    eyebrow: '[05] — FAQ',
    title: 'Häufige Fragen.',
    items: [
      { q: 'Was kostet eine Website?', a: 'Das hängt vom Umfang ab. Eine einfache One-Page Website beginnt ab 1.500 €, eine mehrseitige Website mit Buchungssystem ab 3.000 €. Im kostenlosen Erstgespräch bekommst du ein individuelles Angebot — transparent, ohne versteckte Kosten.' },
      { q: 'Wie lange dauert es, bis meine Website fertig ist?', a: 'Eine einfache Website ist in wenigen Tagen fertig. Komplexere Projekte mit Shop oder individuellen Funktionen dauern 1–2 Wochen. Kein monatelanges Warten — wir setzen schnell um.' },
      { q: 'Brauche ich technisches Wissen?', a: 'Nein, überhaupt nicht. Wir kümmern uns um alles Technische. Nach dem Launch zeigen wir dir in einer Einführung, wie du einfache Änderungen selbst vornehmen kannst — falls gewünscht.' },
      { q: 'Was passiert nach dem Launch?', a: 'Deine Website läuft nicht von allein: Hosting, Updates, Backups und Erreichbarkeit müssen betreut werden. Das übernehme ich ab 49 €/Monat — inklusive Support und kleiner Änderungen. Wenn du lieber selbst betreust, bekommst du alle Zugänge und den Code.' },
      { q: 'Könnt ihr auch bestehende Websites überarbeiten?', a: 'Ja, definitiv. Ob Redesign, Performance-Optimierung oder neue Funktionen — wir schauen uns an, was du hast, und machen daraus etwas Modernes.' },
      { q: 'Kann ich Inhalte später selbst ändern?', a: 'Ja. Du bekommst einen einfachen Redaktionsbereich, in dem du Texte, Bilder, Öffnungszeiten und Preise selbst pflegst — ohne Technikkenntnisse. Nach dem Launch zeige ich dir in einer Einführung, wie es geht. Größere Umbauten übernehme ich auf Wunsch.' },
      { q: 'Wem gehört die Website am Ende?', a: 'Dir — vollständig. Du bekommst den kompletten Quellcode und die Zugänge zu Domain und Hosting. Kein Baukasten-Abo, keine Lizenzgebühren, keine Abhängigkeit von mir: Du könntest die Seite jederzeit von jemand anderem weiterbetreuen lassen.' },
      { q: 'Arbeitet ihr nur mit Unternehmen in Berlin?', a: 'Nein — wir arbeiten mit Unternehmen in ganz Deutschland. Unser Sitz ist in Berlin, aber alles läuft online: Erstgespräch per Video, Entwurf per Link, Abstimmung per Telefon oder E-Mail. Du musst für kein einziges Treffen anreisen.' },
    ] as Faq[],
  },
  cta: {
    title: ['Bereit', 'zu starten?'],
    text: 'Erstgespräch und Entwurf sind kostenlos — 30 Minuten per Video, unverbindlich. Egal, wo in Deutschland du sitzt.',
    button: 'Jetzt anfragen →',
  },
  footer: {
    company: 'JPR Studio ist eine Marke der JPR Consulting GmbH · Letteallee 91 · 13409 Berlin',
    top: 'Nach oben',
    blog: 'Blog' as string | null,
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    review: 'Bewertung auf Google',
  },
  cookie: {
    text: 'Wir verwenden Cookies und Tracking-Technologien (Google Analytics, Facebook Pixel), um unsere Website zu verbessern und Werbeanzeigen zu optimieren. Mehr dazu in unserer',
    privacy: 'Datenschutzerklärung',
    accept: 'Alle akzeptieren',
    necessary: 'Nur notwendige',
  },
  pricingPage: {
    back: 'Zur Startseite',
    h1: ['Webdesign Preise in Berlin —', 'transparent ab 1.500 €'],
    intro: 'Eine professionelle Website kostet bei uns zwischen 1.500 € und 5.000 €+ — je nach Umfang. Keine versteckten Kosten, keine Agentur-Tagessätze: Du bekommst ein festes Angebot, bevor es losgeht. Und den ersten Entwurf gibt es kostenlos. Die Preise gelten deutschlandweit — alles läuft online, du musst nicht in Berlin sitzen.',
    factorsTitle: 'Was den Preis beeinflusst',
    factorsIntro: '„Ab-Preise" sind ehrlich gemeint — hier sind die vier Faktoren, die entscheiden, wo dein Projekt landet.',
    factors: [
      { title: 'Umfang & Seitenanzahl', text: 'Ein One-Pager ist schneller gebaut als zehn Unterseiten mit eigener Struktur. Mehr Seiten bedeuten mehr Konzept, mehr Inhalt, mehr Abstimmung.' },
      { title: 'Design-Anspruch', text: 'Ein sauberes Standard-Design ist im Preis enthalten. Individuelle Illustrationen, Animationen oder ein komplettes Branding kosten zusätzlich Zeit.' },
      { title: 'Funktionen & Schnittstellen', text: 'Terminbuchung, Bezahlung, Kundenverwaltung oder Anbindungen an bestehende Systeme — jede Funktion, die "einfach laufen" soll, muss gebaut und getestet werden.' },
      { title: 'Inhalte & Pflege', text: 'Lieferst du Texte und Bilder, oder erstellen wir sie? Und soll die Seite danach betreut werden? Beides beeinflusst den Gesamtpreis.' },
    ],
    ownTitle: 'Dir gehört der Code',
    ownText: 'Keine Baukasten-Abos, keine Lizenzgebühren, keine Abhängigkeit: Du bekommst den kompletten Quellcode und alle Zugänge. Inhalte pflegst du über einen einfachen Redaktionsbereich selbst, und wenn du willst, kann jederzeit jemand anderes weiterarbeiten.',
    ownLink: 'Mehr dazu im Vergleich →' as string | null,
    guide: { before: 'Du willst tiefer einsteigen? Im Ratgeber', link: '„Was kostet eine Website in Berlin?"', after: 'rechnen wir alle Posten (inkl. versteckter Kosten) im Detail durch.' } as { before: string; link: string; after: string } | null,
    ctaTitle: 'Was kostet deine Website?',
    ctaText: 'Buch dir 30 Minuten — du bekommst ein festes Angebot und den ersten Entwurf kostenlos.',
    ctaButton: 'Kostenlosen Entwurf anfragen →',
    footerHome: 'Startseite',
  },
};

export type SiteCopy = typeof de;

const en: SiteCopy = {
  meta: {
    homeTitle: 'Web Design Berlin — Websites for Local Businesses | JPR Consulting',
    homeDesc: 'Websites with online booking for gyms, practices and trades — built in Berlin, for clients across Germany. Fixed prices from €1,500, you own the code. First draft free.',
    pricingTitle: 'Web Design Prices Berlin 2026 — Websites from €1,500 | JPR Consulting',
    pricingDesc: 'Transparent pricing: one-page website from €1,500, website with online booking from €3,000, shop or web app from €5,000. Fixed quote in a free intro call.',
  },
  nav: {
    links: [
      { label: '[01] Services', id: 'leistungen' },
      { label: '[02] Work', id: 'projekte' },
      { label: '[03] Process', id: 'prozess' },
      { label: '[04] Pricing', id: 'preise' },
      { label: '[05] FAQ', id: 'faq' },
    ],
    cta: 'Request a draft →',
    stickyCta: 'Request a draft',
    switchTo: 'Auf Deutsch wechseln',
  },
  hero: {
    topLeft: 'Web design from Berlin — for all of Germany',
    topRight: 'You own the code — no lock-in',
    h1: ['Websites', 'that win', 'clients.'],
    audience: 'For gyms, practices, trades and local businesses.',
    offer: 'First draft free — see what you get before you commit. Fixed price from €1,500.',
    ctaPrimary: 'Get your free draft now →',
    ctaSecondary: 'See pricing',
    proofs: ['Live in days, not months', 'Fixed price before we start', 'First draft free', 'Anywhere in Germany, fully online'],
    capacity: 'Capacity available — start your project this month.',
  },
  refs: {
    ariaLabel: 'References',
    label: 'Clients & projects',
    items: [
      { name: 'Kampfwerk', what: 'Software for martial arts schools' },
      { name: 'Muay Thai Subyen', what: 'Martial arts school' },
      { name: 'Gamerfunnel', what: 'Playable ad funnels' },
      { name: 'Nomads Digital', what: 'Games marketing' },
      { name: 'RopeFX', what: 'Rope access work' },
    ],
  },
  services: {
    eyebrow: '[01] — Services',
    title: 'Everything in one place.',
    items: [
      { title: 'Modern website', desc: 'Mobile-first, fast and found on Google. You own the code — no website-builder subscription.' },
      { title: 'Online booking', desc: 'Your customers book online — day and night, without picking up the phone.' },
      { title: 'Shops & web apps', desc: 'Payments, customer management, custom features.' },
      { title: 'AI automation', desc: 'Automate your processes — from quote to invoice.' },
    ],
  },
  projects: {
    eyebrow: '[02] — Selected work',
    title: 'Recent work.',
    scrollHint: 'Keep scrolling ↓',
    swipeHint: 'Swipe →',
    altPrefix: 'Website of',
    items: [
      { url: 'kampfwerk.com', href: 'https://kampfwerk.com', title: 'Kampfwerk', tag: 'Software for martial arts schools', img: '/portfolio-shots/kampfwerk.jpg' },
      { url: 'muaythai-subyen.de', href: 'https://www.muaythai-subyen.de', title: 'Muay Thai Subyen', tag: 'Gym website / online membership', img: '/portfolio-shots/subyen.jpg' },
      { url: 'gamerfunnel.com', href: 'https://gamerfunnel.com', title: 'Gamerfunnel', tag: 'Playable ad funnels', img: '/portfolio-shots/gamerfunnel.jpg' },
      { url: 'nomadsdigital.com', href: 'https://www.nomadsdigital.com', title: 'Nomads Digital', tag: 'Games marketing / website', img: '/portfolio-shots/nomads.jpg' },
      { url: 'ropefx.com', href: 'https://ropefx.com', title: 'RopeFX', tag: 'Website / lead funnel', img: '/portfolio-shots/ropefx.jpg' },
    ],
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What our clients say.',
    note: 'Translated from German.',
    reviewCta: 'Happy too? Leave a review on Google →',
    items: [
      {
        quote: 'The website was up within a few days. Since then we regularly get enquiries through it — and it looks really professional. Straightforward and to the point.',
        logo: '/logos/ropefx.webp',
        name: 'Michael Nüske',
        company: 'RopeFX — Industrial climbers, Berlin',
      },
      {
        quote: "Within a week we had a complete website with training schedule, member management and online contract signing. I didn't expect it to be that fast.",
        logo: '/logos/muay-thai-subyen.webp',
        name: 'Sven Markulla',
        company: 'Muay Thai Subyen e.V.',
      },
    ],
  },
  process: {
    eyebrow: '[03] — Process',
    title: 'How it works.',
    steps: [
      { title: 'Free intro call', desc: 'We talk about your business, your goals and what you need. 30 minutes, no strings attached.' },
      { title: 'Free draft', desc: "You get a first draft of your website — completely free. We only continue once you're happy with it." },
      { title: 'Build & launch', desc: 'We build, you give feedback, we go live. You get an onboarding session and ongoing support.' },
    ],
  },
  about: {
    eyebrow: 'Your contact',
    photoAlt: 'Jan Rojek, founder of JPR Studio',
    badge: 'Berlin / Founder',
    hello: "Hi, I'm",
    name: 'Jan.',
    paragraphs: [
      "For more than 7 years I've been building websites and digital solutions — from websites for local businesses to automation systems for international companies.",
      'What drives me: when a tradesperson suddenly gets enquiries through their website. Or when a practice has online booking and the phone finally stops ringing all day.',
    ],
    highlight: 'I speak your language — not developer jargon. You tell me what your business needs, and I build it.',
    facts: ['7+ years of web development', 'You talk directly to the person who builds'],
  },
  pricing: {
    eyebrow: '[04] — Pricing / fixed price before we start',
    pageEyebrow: 'Pricing',
    title: 'Transparent. No day rates.',
    reco: '✦ Recommended',
    cta: 'Request a draft',
    note: 'All prices net plus VAT · Instalments possible · Care plan from €49/month (hosting, updates, backups, support)',
    detailsLink: 'All prices in detail →',
    tiers: [
      { name: 'Starter', for: 'For getting started', price: 'from €1,500', reco: false, features: ['One-page website', 'Mobile-optimised', 'Contact form', 'Google Maps integration', 'Basic SEO', '1 revision round'] },
      { name: 'Professional', for: 'Our most popular package', price: 'from €3,000', reco: true, features: ['Multi-page website', 'Online booking', 'Team & service pages', 'Advanced SEO', 'Google Analytics', 'Gallery / portfolio', '3 revision rounds', 'Onboarding & support'] },
      { name: 'Business', for: 'For demanding projects', price: 'from €5,000', reco: false, features: ['Everything in Professional', 'Online shop or web app', 'Customer management / backend', 'Custom features', 'Automations', 'Ongoing support', 'Unlimited revisions'] },
    ],
  },
  faq: {
    eyebrow: '[05] — FAQ',
    title: 'Frequently asked questions.',
    items: [
      { q: 'How much does a website cost?', a: 'It depends on the scope. A simple one-page website starts at €1,500, a multi-page website with a booking system at €3,000. In the free intro call you get an individual quote — transparent, with no hidden costs.' },
      { q: 'How long until my website is ready?', a: 'A simple website is ready within a few days. More complex projects with a shop or custom features take 1–2 weeks. No waiting for months — we move fast.' },
      { q: 'Do I need technical knowledge?', a: 'No, not at all. We take care of everything technical. After launch we show you in an onboarding session how to make simple changes yourself — if you want to.' },
      { q: 'What happens after launch?', a: "Your website doesn't run by itself: hosting, updates, backups and uptime need looking after. I take care of that from €49/month — including support and small changes. If you'd rather manage it yourself, you get all access and the code." },
      { q: 'Can you also redesign an existing website?', a: "Yes, absolutely. Whether it's a redesign, performance work or new features — we look at what you have and turn it into something modern." },
      { q: 'Can I edit the content myself later?', a: "Yes. You get a simple editing area where you update texts, images, opening hours and prices yourself — no technical skills needed. After launch I'll walk you through it. Bigger changes I handle on request." },
      { q: 'Who owns the website in the end?', a: 'You do — completely. You get the full source code and access to domain and hosting. No builder subscription, no licence fees, no dependency on me: anyone else could take over the site at any time.' },
      { q: 'Do you only work with businesses in Berlin?', a: "No — we work with businesses all over Germany. We're based in Berlin, but everything runs online: intro call via video, draft via link, coordination by phone or email. You never have to travel for a meeting." },
      { q: 'Can we work together in English?', a: 'Yes. Calls, drafts and support work in English or German — whichever you prefer. Your website itself can be in one language or both.' },
    ],
  },
  cta: {
    title: ['Ready', 'to start?'],
    text: 'The intro call and the draft are free — 30 minutes via video, no strings attached. Wherever you are in Germany.',
    button: 'Get in touch →',
  },
  footer: {
    company: 'JPR Studio is a brand of JPR Consulting GmbH · Letteallee 91 · 13409 Berlin, Germany',
    top: 'Back to top',
    blog: null,
    imprint: 'Imprint',
    privacy: 'Privacy',
    review: 'Review us on Google',
  },
  cookie: {
    text: 'We use cookies and tracking technologies (Google Analytics, Facebook Pixel) to improve our website and optimise our ads. Learn more in our',
    privacy: 'privacy policy (German)',
    accept: 'Accept all',
    necessary: 'Only necessary',
  },
  pricingPage: {
    back: 'Back to home',
    h1: ['Web design prices —', 'transparent, from €1,500'],
    intro: "A professional website costs between €1,500 and €5,000+, depending on the scope. No hidden costs, no agency day rates: you get a fixed quote before we start. And the first draft is free. Prices apply across Germany — everything runs online, you don't need to be in Berlin.",
    factorsTitle: 'What affects the price',
    factorsIntro: '"From" prices are meant honestly — these are the four factors that decide where your project lands.',
    factors: [
      { title: 'Scope & number of pages', text: 'A one-pager is quicker to build than ten sub-pages with their own structure. More pages mean more concept, more content and more coordination.' },
      { title: 'Design ambition', text: 'A clean standard design is included. Custom illustrations, animations or a complete brand identity take extra time.' },
      { title: 'Features & integrations', text: 'Booking, payments, customer management or connections to existing systems — every feature that should "just work" has to be built and tested.' },
      { title: 'Content & maintenance', text: 'Do you provide texts and images, or do we create them? And should the site be looked after once it is live? Both affect the total price.' },
    ],
    ownTitle: 'You own the code',
    ownText: 'No builder subscriptions, no licence fees, no lock-in: you get the complete source code and all access. You edit content yourself in a simple editing area, and anyone else can take over at any time.',
    ownLink: null,
    guide: null,
    ctaTitle: 'What will your website cost?',
    ctaText: 'Book 30 minutes — you get a fixed quote and the first draft for free.',
    ctaButton: 'Get your free draft →',
    footerHome: 'Home',
  },
};

export const copy: Record<Lang, SiteCopy> = { de, en };

/** Adressen pro Sprache. Blog, Impressum und Datenschutz bleiben deutsch. */
export const paths = {
  home: { de: '/', en: '/en' },
  pricing: { de: '/preise', en: '/en/pricing' },
} as const;
