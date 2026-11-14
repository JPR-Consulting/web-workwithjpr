import React from 'react';
import { useCopy } from '../i18n';

export interface Project {
  url: string;
  href: string;
  title: string;
  tag: string;
  img: string;
}

interface Props {
  projects: Project[];
  /** Eyebrow + Titel über dem Laufband. */
  header: React.ReactNode;
}

const ProjectCard: React.FC<{ p: Project; altPrefix: string; hidden?: boolean }> = ({ p, altPrefix, hidden }) => (
  <a
    href={p.href}
    target="_blank"
    rel="noopener noreferrer"
    tabIndex={hidden ? -1 : undefined}
    className="proj-card group block shrink-0 w-[78vw] max-w-[340px] md:w-[440px] md:max-w-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
  >
    <div className="border border-line bg-panel mb-4 transition-colors duration-300 group-hover:border-accent/50">
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-line">
        <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
        <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
        <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
        <span className="ml-auto font-mono text-[13px] text-muted">{p.url}</span>
      </div>
      <div className="aspect-[1200/617] relative overflow-hidden bg-panel">
        <img
          src={p.img}
          alt={hidden ? '' : `${altPrefix} ${p.title}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-[1.03]"
        />
      </div>
    </div>
    <h3 className="font-syne font-bold text-[20px] md:text-[22px] text-ftext">{p.title}</h3>
    <div className="font-mono text-[13px] text-muted uppercase mt-1">{p.tag}</div>
  </a>
);

/**
 * Projekte als Laufband (Handy und Rechner gleich): läuft von allein durch, hält bei
 * Maus oder Tastatur-Fokus an. Ersetzt den gepinnten Coverflow (kostete ~5 Bildschirme
 * Scrollweg, Jan 14.11.2026). Bei "Bewegung reduzieren": stehendes Band zum Wischen.
 */
const ProjectCarousel: React.FC<Props> = ({ projects, header }) => {
  const t = useCopy().projects;
  return (
    <div>
      <div className="px-6 md:px-12">{header}</div>
      <div className="proj-strip overflow-hidden" style={{ ['--proj-dur' as string]: `${projects.length * 9}s` }}>
        <div className="proj-track flex w-max">
          {[0, 1].map((half) => (
            <div key={half} className="proj-half flex gap-5 md:gap-8 pr-5 md:pr-8" aria-hidden={half === 1 ? true : undefined}>
              {projects.map((p) => (
                <ProjectCard key={p.href} p={p} altPrefix={t.altPrefix} hidden={half === 1} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
