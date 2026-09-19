// Prerender: erzeugt nach `vite build` statisches HTML pro Route.
// Jede Blog-URL bekommt eigenen Title, Description, Canonical, og-Tags,
// BlogPosting-Schema und den Artikel-Inhalt im Quelltext (im #root,
// wird beim Laden von React ersetzt — kein Cloaking, echter Content).
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { marked } from 'marked';

const SITE = 'https://workwithjpr.com';
const DIST = 'dist';

// Blog-Inhalte laden (TS → ESM via esbuild)
execSync('npx esbuild content/blog/index.ts --bundle --format=esm --outfile=.prerender-content.mjs', { stdio: 'inherit' });
const { blogPosts } = await import(new URL('../.prerender-content.mjs', import.meta.url));
rmSync('.prerender-content.mjs');

// Texte von Start- und Preisseite (DE/EN) — dieselbe Quelle wie die App
execSync('npx esbuild content/site-copy.ts --bundle --format=esm --outfile=.prerender-copy.mjs', { stdio: 'inherit' });
const { copy, paths } = await import(new URL('../.prerender-copy.mjs', import.meta.url));
rmSync('.prerender-copy.mjs');

const fullTemplate = readFileSync(`${DIST}/index.html`, 'utf8');
// index.html bringt ein FAQ-Schema mit. Es gehört nur zur Startseite und wird
// dort aus site-copy neu erzeugt; alle anderen Seiten bekommen es nicht.
const FAQ_LD = /<script type="application\/ld\+json">(?:(?!<\/script>)[\s\S])*?"FAQPage"[\s\S]*?<\/script>\s*/;
if (!FAQ_LD.test(fullTemplate)) throw new Error('FAQPage-Block in index.html nicht gefunden');
const template = fullTemplate.replace(FAQ_LD, '');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const url = (p) => `${SITE}${p}`;
const hreflang = (alt) =>
  `<link rel="alternate" hreflang="de" href="${url(alt.de)}" />\n` +
  `<link rel="alternate" hreflang="en" href="${url(alt.en)}" />\n` +
  `<link rel="alternate" hreflang="x-default" href="${url(alt.de)}" />\n`;
const faqLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function renderPage({ title, description, canonical, ogType, rootHtml, jsonLd, lang = 'de', alternates = null }) {
  let html = template;
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${lang === 'en' ? 'en_GB' : 'de_DE'}$2`);
  if (alternates) html = html.replace('</head>', `${hreflang(alternates)}</head>`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  if (jsonLd) html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`);
  if (rootHtml) html = html.replace(/<div id="root">[\s\S]*?<\/body>/, `<div id="root">${rootHtml}</div>\n  </body>`);
  return html;
}

// Kopfzeile mit Logo, damit der Moment vor dem Mount nach der Seite aussieht
// und nicht nach einem nackten Textabzug.
const shell = (inner) => `
<div style="min-height:100vh;background:#09090b;color:#d4d4d8;font-family:system-ui,-apple-system,sans-serif">
<div style="border-bottom:1px solid #27272a">
<div style="max-width:768px;margin:0 auto;padding:16px 20px;display:flex;align-items:center;gap:12px">
<img src="/JPR1.webp" alt="JPR Consulting" width="34" height="34" style="border-radius:50%">
<span style="color:#fff;font-weight:600;letter-spacing:-.01em">JPR Consulting</span></div></div>
<div style="max-width:768px;margin:0 auto;padding:60px 20px;line-height:1.7">${inner}</div></div>`;

// --- Blog-Artikel ---
for (const post of blogPosts) {
  const url = `${SITE}/blog/${post.slug}`;
  const body = marked.parse(post.content);
  const rootHtml = shell(`
    <p><a href="/blog" style="color:#22d3ee">← Alle Artikel</a></p>
    <article>
      <h1 style="color:#fff;font-size:2.2rem;line-height:1.2">${esc(post.title)}</h1>
      <p style="color:#71717a">${new Date(post.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })} · ${esc(post.readTime)} · ${post.tags.map(esc).join(', ')}</p>
      <div class="article-body" style="color:#d4d4d8">${body}</div>
    </article>
    <p style="margin-top:40px;border-top:1px solid #27272a;padding-top:20px;color:#a1a1aa">
      <strong style="color:#fff">Jan Rojek</strong> — Gründer &amp; Webentwickler bei JPR Consulting GmbH.
      Über 7 Jahre Erfahrung in Webentwicklung, Performance Marketing und KI-Automatisierung.</p>
    <p><a href="/" style="color:#22d3ee">JPR Consulting — Webdesign Berlin</a></p>`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Jan Rojek', url: 'https://www.linkedin.com/in/jan-rojek-b31474a', jobTitle: 'Gründer & Webentwickler', worksFor: { '@type': 'Organization', name: 'JPR Consulting GmbH' } },
    publisher: { '@type': 'Organization', name: 'JPR Consulting GmbH', logo: { '@type': 'ImageObject', url: `${SITE}/JPR1.png` } },
    mainEntityOfPage: url,
  };
  mkdirSync(`${DIST}/blog/${post.slug}`, { recursive: true });
  writeFileSync(`${DIST}/blog/${post.slug}/index.html`, renderPage({
    title: `${post.title} | JPR Consulting`,
    description: post.description,
    canonical: url,
    ogType: 'article',
    rootHtml,
    jsonLd,
  }));
  console.log(`✓ /blog/${post.slug}`);
}

// --- Blog-Übersicht (mit crawlbaren Links) ---
const listHtml = shell(`
  <h1 style="color:#fff;font-size:2.2rem">Blog — Webdesign, SEO &amp; Online-Marketing für lokale Unternehmen</h1>
  <ul style="list-style:none;padding:0">${blogPosts.map(p => `
    <li style="margin:24px 0;border-bottom:1px solid #27272a;padding-bottom:24px">
      <a href="/blog/${p.slug}" style="color:#fff;font-size:1.2rem;font-weight:600;text-decoration:none">${esc(p.title)}</a>
      <p style="color:#a1a1aa;margin:6px 0 0">${esc(p.description)}</p>
    </li>`).join('')}
  </ul>
  <p><a href="/" style="color:#22d3ee">JPR Consulting — Webdesign Berlin</a></p>`);
mkdirSync(`${DIST}/blog`, { recursive: true });
writeFileSync(`${DIST}/blog/index.html`, renderPage({
  title: 'Blog: Webdesign, SEO & Online-Marketing Tipps | JPR Consulting Berlin',
  description: 'Praktische Tipps für lokale Unternehmen: Was kostet eine Website, SEO-Basics, Online-Kundengewinnung und mehr — vom Berliner Webdesign-Team.',
  canonical: `${SITE}/blog`,
  ogType: 'website',
  rootHtml: listHtml,
}));
console.log('✓ /blog');

// --- Imprint & Privacy (nur korrekte Meta/Canonical, noindex-frei) ---
for (const [route, title] of [['imprint', 'Impressum | JPR Consulting'], ['privacy', 'Datenschutzerklärung | JPR Consulting']]) {
  mkdirSync(`${DIST}/${route}`, { recursive: true });
  writeFileSync(`${DIST}/${route}/index.html`, renderPage({
    title,
    description: `${title.split(' | ')[0]} der JPR Consulting GmbH, Berlin.`,
    canonical: `${SITE}/${route}`,
    ogType: 'website',
    rootHtml: null,
  }));
  console.log(`✓ /${route}`);
}


// --- Preisseiten /preise und /en/pricing (Commercial-Intent-Landingpage) ---
const alternatesPricing = { de: paths.pricing.de, en: paths.pricing.en };
for (const lang of ['de', 'en']) {
  const t = copy[lang];
  const p = t.pricingPage;
  const pageUrl = url(paths.pricing[lang]);
  const priceNum = (price) => price.replace(/[^\d]/g, '');
  const rootHtml = shell(`
    <p><a href="${paths.home[lang]}" style="color:#22d3ee">← ${esc(p.back)}</a></p>
    <h1 style="color:#fff;font-size:2.2rem;line-height:1.2">${esc(p.h1.join(' '))}</h1>
    <p>${esc(p.intro)}</p>
    ${t.pricing.tiers.map(tier => `
    <h2 style="color:#fff">${esc(tier.name)} — ${esc(tier.price)} (${esc(tier.for)})</h2>
    <ul>${tier.features.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`).join('')}
    <p>${esc(t.pricing.note)}</p>
    <h2 style="color:#fff">${esc(p.factorsTitle)}</h2>
    <ul>${p.factors.map(fa => `<li><strong style="color:#fff">${esc(fa.title)}</strong> — ${esc(fa.text)}</li>`).join('')}</ul>
    <h2 style="color:#fff">${esc(t.faq.title)}</h2>
    ${t.faq.items.map(fq => `<h3 style="color:#fff">${esc(fq.q)}</h3><p>${esc(fq.a)}</p>`).join('')}
    ${lang === 'de' ? `<p>Ratgeber: <a href="/blog/was-kostet-eine-website-berlin" style="color:#22d3ee">Wovon der Preis einer Website abhängt — Kostenfaktoren &amp; versteckte Kosten</a></p>` : ''}
    <p><a href="${paths.home[lang]}" style="color:#22d3ee">JPR Studio — ${lang === 'de' ? 'Webdesign Berlin' : 'Web design Berlin'}</a></p>`);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: lang === 'de' ? 'Webdesign Berlin' : 'Web design Berlin',
      serviceType: lang === 'de' ? 'Webdesign' : 'Web design',
      areaServed: [{ '@type': 'City', name: 'Berlin' }, { '@type': 'Country', name: 'Deutschland' }],
      provider: { '@type': 'ProfessionalService', name: 'JPR Consulting GmbH', url: SITE, telephone: '+4917631504123', address: { '@type': 'PostalAddress', streetAddress: 'Letteallee 91', postalCode: '13409', addressLocality: 'Berlin', addressCountry: 'DE' } },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: lang === 'de' ? 'Webdesign Pakete' : 'Web design packages',
        itemListElement: t.pricing.tiers.map(tier => ({
          '@type': 'Offer',
          name: `${tier.name} — ${tier.for}`,
          priceSpecification: { '@type': 'PriceSpecification', minPrice: priceNum(tier.price), priceCurrency: 'EUR' },
          url: pageUrl,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'de' ? 'Start' : 'Home', item: url(paths.home[lang]) },
        { '@type': 'ListItem', position: 2, name: t.pricing.pageEyebrow, item: pageUrl },
      ],
    },
    faqLd(t.faq.items),
  ];
  mkdirSync(`${DIST}${paths.pricing[lang]}`, { recursive: true });
  writeFileSync(`${DIST}${paths.pricing[lang]}/index.html`, renderPage({
    title: t.meta.pricingTitle,
    description: t.meta.pricingDesc,
    canonical: pageUrl,
    ogType: 'website',
    rootHtml,
    jsonLd,
    lang,
    alternates: alternatesPricing,
  }));
  console.log(`✓ ${paths.pricing[lang]}`);
}

// --- Startseiten / und /en ---
// Der erste Bildschirm bildet den echten Hero nach (sonst blitzt vor dem
// Mount eine schmale Textspalte auf); der Rest bleibt für Crawler lesbar.
const mono = "font-family:'IBM Plex Mono',ui-monospace,monospace";
const homeFallback = (t, lang) => `<div style="min-height:100vh;background:#101012;color:#f4f4f0;font-family:'Syne','Space Grotesk',system-ui,-apple-system,sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 48px;border-bottom:1px solid #26262a">
        <div style="font-weight:800;font-size:19px;text-transform:uppercase;letter-spacing:.01em">JPR <span style="color:#d4ff4f">Studio</span>&reg;</div>
        <div style="${mono};font-size:13px;background:#d4ff4f;color:#101012;padding:13px 22px;text-transform:uppercase">${esc(t.nav.cta)}</div>
      </div>
      <header style="padding:120px 48px 72px 48px;box-sizing:border-box">
        <div style="display:flex;justify-content:space-between;${mono};font-size:13px;color:#b4b4bc;text-transform:uppercase;margin-bottom:48px">
          <span>${esc(t.hero.topLeft)}</span><span>${esc(t.hero.topRight)}</span>
        </div>
        <h1 style="margin:0;font-weight:800;text-transform:uppercase;font-size:clamp(52px,9vw,132px);line-height:.95;letter-spacing:-.02em">
          <span style="display:block">${esc(t.hero.h1[0])}</span>
          <span style="display:block;color:#d4ff4f">${esc(t.hero.h1[1])}</span>
          <span style="display:block;-webkit-text-stroke:2px #f4f4f0;color:transparent">${esc(t.hero.h1[2])}</span>
        </h1>
        <p style="margin:56px 0 0;font-size:18px;line-height:1.65;color:#d8d8de;max-width:460px">${esc(t.hero.offer)}</p>
        <p style="margin:28px 0 0;font-size:20px;color:#f4f4f0">${esc(t.hero.audience)}</p>
      </header>
      <main style="padding:0 48px 64px 48px;box-sizing:border-box;color:#b4b4bc;font-family:'Space Grotesk',system-ui,sans-serif;line-height:1.7">
        <h2 style="font-weight:800;text-transform:uppercase;color:#f4f4f0">${esc(t.services.title)}</h2>
        <ul>${t.services.items.map(i => `<li><strong style="color:#f4f4f0">${esc(i.title)}</strong> — ${esc(i.desc)}</li>`).join('')}</ul>
        <h2 style="font-weight:800;text-transform:uppercase;color:#f4f4f0">${esc(t.projects.title)}</h2>
        <ul>${t.projects.items.map(i => `<li><a href="${i.href}" style="color:#d4ff4f">${esc(i.title)}</a> — ${esc(i.tag)}</li>`).join('')}</ul>
        <h2 style="font-weight:800;text-transform:uppercase;color:#f4f4f0">${esc(t.pricing.title)}</h2>
        <p>${t.pricing.tiers.map(tier => `${esc(tier.name)} ${esc(tier.price)}`).join(' &middot; ')}. ${esc(t.pricing.note)} <a href="${paths.pricing[lang]}" style="color:#d4ff4f">${esc(t.pricing.detailsLink)}</a></p>
        <h2 style="font-weight:800;text-transform:uppercase;color:#f4f4f0">${esc(t.faq.title)}</h2>
        ${t.faq.items.map(fq => `<h3 style="color:#f4f4f0">${esc(fq.q)}</h3><p>${esc(fq.a)}</p>`).join('')}
        <p>${esc(t.footer.company)} &middot; info@workwithjpr.com &middot; +49 176 31 50 4123</p>
        <p><a href="${paths.home[lang === 'de' ? 'en' : 'de']}" style="color:#d4ff4f">${lang === 'de' ? 'English version' : 'Deutsche Version'}</a>${lang === 'de' ? ' &middot; <a href="/blog" style="color:#d4ff4f">Blog</a>' : ''}</p>
      </main>
    </div>`;

const alternatesHome = { de: paths.home.de, en: paths.home.en };
for (const lang of ['en', 'de']) {
  const t = copy[lang];
  const out = lang === 'de' ? `${DIST}/index.html` : `${DIST}${paths.home.en}/index.html`;
  mkdirSync(out.replace(/\/index\.html$/, ''), { recursive: true });
  writeFileSync(out, renderPage({
    title: t.meta.homeTitle,
    description: t.meta.homeDesc,
    canonical: lang === 'de' ? `${SITE}/` : url(paths.home.en),
    ogType: 'website',
    rootHtml: homeFallback(t, lang),
    jsonLd: faqLd(t.faq.items),
    lang,
    alternates: alternatesHome,
  }));
  console.log(`✓ ${paths.home[lang]}`);
}

console.log(`Prerender fertig: ${blogPosts.length} Artikel + Blog-Index + 2 Rechtsseiten + Start/Preise in DE und EN.`);
