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

const template = readFileSync(`${DIST}/index.html`, 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderPage({ title, description, canonical, ogType, rootHtml, jsonLd }) {
  let html = template;
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

console.log(`Prerender fertig: ${blogPosts.length} Artikel + Blog-Index + 2 Rechtsseiten.`);
