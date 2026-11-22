// Holt AGB und AVV aus den Vertragsvorlagen (Markdown mit Front-Matter) in dieses Repo.
//   node scripts/sync-legal.mjs <ordner>      z. B. ../tom-v3/vertraege-v2
// Schreibt content/legal/agb.md, content/legal/avv.md und content/legal/legal.ts
// (die .ts-Datei liest die Seite und der Prerender; sie wird nur von diesem Skript erzeugt).
// Was das Skript tut: Front-Matter entfernen, {{feld}} auf den Standardwert aus dem Front-Matter
// setzen, {{#if}}-Blöcke auflösen. Für die öffentliche Seite gelten zusätzlich die Werte in
// PUBLIC: Sie ersetzen leere Standardwerte und "[ZU BESTÄTIGEN …]"-Platzhalter, echte Werte
// aus der Vorlage bleiben unangetastet. Ist die Vorlage fertig, fallen die Ersatzwerte von selbst weg.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('Aufruf: node scripts/sync-legal.mjs <ordner mit 06-agb.md und 07-avv.md>');
  process.exit(1);
}

const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

// Fakten aus Impressum/Datenschutz; Kundenfelder des AVV bleiben auf der öffentlichen Seite Mustertext.
const PUBLIC = {
  agb: {
    agb_stand: today,
    firma_email: 'info@workwithjpr.com',
    firma_registergericht: 'Amtsgericht Charlottenburg',
    firma_hrb: 'HRB 207244 B',
    firma_geschaeftsfuehrer: 'Jan Rojek',
    firma_ust_id: 'DE325110304',
    datenschutz_link: 'https://workwithjpr.com/privacy',
    haftung_hoechstbetrag: '', // kein fester Höchstbetrag, solange die Versicherungssumme nicht bestätigt ist
  },
  avv: {
    avv_nr: 'laut Angebot',
    hauptvertrag: 'Angebot, Betreuungsvertrag und Zusatzvereinbarungen',
    kunde_firma: 'der Auftraggeber (Kunde gemäß Angebot)',
    kunde_strasse: 'Anschrift laut Angebot',
    kunde_plz_ort: '',
    kunde_ansprechpartner: 'die im Angebot genannte Person',
    kunde_datenschutz_kontakt: '',
    firma_registergericht: 'Amtsgericht Charlottenburg',
    firma_hrb: 'HRB 207244 B',
    firma_geschaeftsfuehrer: 'Jan Rojek',
    jpr_datenschutz_kontakt: 'info@workwithjpr.com',
    jpr_unterzeichner: 'Jan Rojek',
    jpr_unterzeichner_funktion: '(Geschäftsführer)',
  },
};

const isPlaceholder = (v) => v === '' || v == null || (typeof v === 'string' && v.includes('[ZU BESTÄTIGEN'));
const truthy = (v) => !(v === '' || v == null || v === false || /^(false|nein|no|0)$/i.test(String(v).trim()));

function build(file, key) {
  const raw = matter(readFileSync(resolve(src, file), 'utf8'));
  const fm = raw.data;
  const vals = { heute: today };
  for (const f of fm.fields ?? []) {
    let v = f.default;
    if (key && Object.hasOwn(PUBLIC[key], f.key) && isPlaceholder(v)) v = PUBLIC[key][f.key];
    vals[f.key] = typeof v === 'string' ? v.replaceAll('{{heute}}', today) : v;
  }
  // Felder, die nur im Ersatz-Satz stehen (nicht im Front-Matter), ebenfalls zulassen
  for (const [k, v] of Object.entries(PUBLIC[key] ?? {})) if (!(k in vals)) vals[k] = v;
  const subst = (s) => s.replace(/\{\{\s*([\w]+)\s*\}\}/g, (m, k) => {
    if (!(k in vals)) throw new Error(`${file}: unbekanntes Feld {{${k}}}`);
    return String(vals[k]);
  });
  let body = raw.content;
  // {{#if k}}a{{else}}b{{/if}} (nicht verschachtelt)
  body = body.replace(/\{\{#if\s+(\w+)\s*\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (m, k, a, b = '') => {
    if (!(k in vals)) throw new Error(`${file}: unbekanntes Feld in {{#if ${k}}}`);
    return truthy(vals[k]) ? a : b;
  });
  // Das Front-Matter-Feld stand kann selbst ein {{feld}} sein
  const meta = {
    title: String(fm.title),
    version: String(vals.agb_version ?? fm.version ?? ''),
    stand: subst(String(fm.stand ?? vals.datum ?? today)),
  };
  body = subst(body);
  if (key === 'agb') body = body.replace(/^Version .*Stand .*\n+/m, ''); // steht oben auf der Seite als Stand-Zeile
  if (key === 'avv') body = body.replace(/^\*\*Annahme-Nachweis.*\n+/m, ''); // Systemzeile, nur im unterschriebenen Dokument
  body = body.replace(/,\s*,/g, ','); // leere Felder (z. B. PLZ/Ort) ohne Doppelkomma
  const left = body.match(/\[ZU BESTÄTIGEN[^\]]*\]/g) ?? [];
  if (left.length) console.warn(`! ${file}: ${left.length} offene Platzhalter "[ZU BESTÄTIGEN …]" im Text`);
  return { meta, body: body.trim() + '\n' };
}

const out = {};
mkdirSync(resolve(root, 'content/legal'), { recursive: true });
for (const [key, file] of [['agb', '06-agb.md'], ['avv', '07-avv.md']]) {
  const { meta, body } = build(file, key);
  writeFileSync(resolve(root, `content/legal/${key}.md`), body);
  out[key] = { ...meta, md: body };
  console.log(`✓ content/legal/${key}.md  (Version ${meta.version}, Stand ${meta.stand})`);
}
writeFileSync(
  resolve(root, 'content/legal/legal.ts'),
  `// ERZEUGT von scripts/sync-legal.mjs — nicht von Hand bearbeiten (Quelle: content/legal/*.md).\n` +
    `export interface LegalDoc { title: string; version: string; stand: string; md: string }\n` +
    `export const legal: Record<'agb' | 'avv', LegalDoc> = ${JSON.stringify(out, null, 2)};\n`,
);
