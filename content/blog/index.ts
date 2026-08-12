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
  tags: string[];
  readTime: string;
  content: string;
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

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
