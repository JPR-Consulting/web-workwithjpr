import { post as wasKostet } from './was-kostet-eine-website-berlin';
import { post as automatisierung } from './automatisierung-fuer-kleine-unternehmen';
import { post as backend } from './individuelles-backend-vs-wordpress';
import { post as kiSeo } from './ki-suchmaschinenoptimierung-2026';
import { post as handwerker } from './website-fuer-handwerker-berlin';
import { post as praxis } from './online-terminbuchung-praxis';
import { post as zeichen } from './5-zeichen-veraltete-website';
import { post as seoBasics } from './seo-basics-lokale-unternehmen';
import { post as kampfsport } from './website-fuer-kampfsport-gyms';
import { post as kundengewinnung } from './online-kundengewinnung';
import { post as vibeCoding } from './vibe-coding-unternehmen';
import { post as werbeanzeigen } from './warum-werbeanzeigen-nicht-funktionieren';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Letzte inhaltliche Änderung (YYYY-MM-DD), für dateModified im Schema. */
  updated?: string;
  /** Vollständiger Title-Tag für Google, falls er von der H1 abweichen soll (wird ohne Marken-Zusatz verwendet). */
  seoTitle?: string;
  /** Meta-Description, falls sie von der Beschreibung in der Übersicht abweichen soll. */
  seoDescription?: string;
  tags: string[];
  readTime: string;
  content: string;
  /** Häufige Fragen unter dem Artikel; der Prerender erzeugt daraus auch das FAQPage-Schema. */
  faq?: { q: string; a: string }[];
}

export const blogPosts: BlogPost[] = [
  wasKostet,
  automatisierung,
  backend,
  kiSeo,
  handwerker,
  praxis,
  zeichen,
  seoBasics,
  kampfsport,
  kundengewinnung,
  vibeCoding,
  werbeanzeigen,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/**
 * Einleitung und Themen-Wegweiser der Blog-Übersicht (/blog). Wird von BlogIndex
 * und vom Prerender gelesen, damit sichtbarer Text und vorgerendertes HTML gleich sind.
 */
export const blogIntro = {
  title: 'Blog: Webdesign, SEO & Online-Marketing Tipps | JPR Consulting Berlin',
  description: 'Praktische Tipps für lokale Unternehmen: Was kostet eine Website, SEO-Basics, Online-Kundengewinnung und mehr — vom Berliner Webdesign-Team.',
  paragraphs: [
    'Hier schreibt Jan Rojek, Gründer von JPR Studio, darüber, was lokale Betriebe online weiterbringt. Websites, über die Anfragen kommen. Online-Terminbuchung. Sichtbarkeit bei Google und in KI-Suchen. Und Automatisierung, die im Büro Zeit spart. Geschrieben für Inhaber von Handwerksbetrieben, Praxen, Gyms und anderen lokalen Unternehmen – verständlich, mit echten Preisen und Beispielen aus unseren Projekten.',
    'Du planst eine neue Website? Dann starte mit den Kosten. Unsere Pakete mit Festpreis stehen auf der Preisseite; was eine Website bei Baukasten, Freelancer und Agentur kostet, vergleicht der Ratgeber „Webdesign-Preise in Berlin“. Für Handwerksbetriebe und Praxen gibt es eigene Seiten mit Beispiel-Entwürfen.',
  ],
  groups: [
    {
      title: 'Kosten & Planung',
      links: [
        { label: 'Webdesign-Preise mit Festpreis-Paketen', href: '/preise' },
        { label: 'Webdesign-Preise in Berlin: Was kostet eine Website?', href: '/blog/was-kostet-eine-website-berlin' },
        { label: 'Individuelles Backend oder WordPress?', href: '/blog/individuelles-backend-vs-wordpress' },
        { label: '5 Zeichen, dass deine Website veraltet ist', href: '/blog/5-zeichen-veraltete-website' },
      ],
    },
    {
      title: 'Nach Branche',
      links: [
        { label: 'Website für Handwerker', href: '/website-fuer-handwerker' },
        { label: 'Was eine Handwerker-Website können muss', href: '/blog/website-fuer-handwerker-berlin' },
        { label: 'Website für Praxen', href: '/website-fuer-praxen' },
        { label: 'Online-Terminbuchung für Praxen', href: '/blog/online-terminbuchung-praxis' },
        { label: 'Website für Kampfsport-Gyms', href: '/blog/website-fuer-kampfsport-gyms' },
      ],
    },
    {
      title: 'Gefunden werden & Kunden gewinnen',
      links: [
        { label: 'SEO-Basics für lokale Unternehmen', href: '/blog/seo-basics-lokale-unternehmen' },
        { label: 'Gefunden werden von ChatGPT und Google AI', href: '/blog/ki-suchmaschinenoptimierung-2026' },
        { label: 'Online-Kundengewinnung: was 2026 funktioniert', href: '/blog/online-kundengewinnung' },
        { label: 'Warum deine Werbeanzeigen nicht funktionieren', href: '/blog/warum-werbeanzeigen-nicht-funktionieren' },
      ],
    },
    {
      title: 'Automatisierung & KI',
      links: [
        { label: 'Automatisierung für kleine Unternehmen', href: '/blog/automatisierung-fuer-kleine-unternehmen' },
        { label: 'Was Vibe-Coding deinem Unternehmen bringt', href: '/blog/vibe-coding-unternehmen' },
      ],
    },
  ],
};

/** Title-Tag eines Artikels — dieselbe Regel in App und Prerender. */
export function blogPostTitle(post: BlogPost): string {
  return post.seoTitle ?? `${post.title} | JPR Consulting`;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
