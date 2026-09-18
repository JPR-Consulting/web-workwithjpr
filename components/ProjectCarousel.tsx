import React, { useEffect, useRef, useState } from 'react';

export interface Project {
  url: string;
  href: string;
  title: string;
  tag: string;
  img: string;
}

interface Props {
  projects: Project[];
  /** Eyebrow + Titel; steht im gepinnten Modus mit im festgehaltenen Bereich. */
  header: React.ReactNode;
}

/** Scrollstrecke pro Karte im gepinnten Modus (in vh). */
const VH_PER_CARD = 60;

const ProjectCard = React.forwardRef<HTMLAnchorElement, { p: Project; focused: boolean; style?: React.CSSProperties; className?: string }>(
  ({ p, focused, style, className = '' }, ref) => (
    <a
      ref={ref}
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={`group block shrink-0 ${className}`}
    >
      <div
        className={`border bg-panel mb-4 transition-[border-color,box-shadow] duration-500 ${
          focused ? 'border-accent/40 shadow-[0_24px_60px_rgba(0,0,0,0.55)]' : 'border-line'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-line">
          <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
          <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
          <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
          <span className="ml-auto font-mono text-[13px] text-muted">{p.url}</span>
        </div>
        <div className="aspect-[1200/617] relative overflow-hidden bg-panel">
          <img
            src={p.img}
            alt={`Website von ${p.title}`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-top transition-[filter,transform] duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-[1.03] ${
              focused ? 'grayscale-0' : 'grayscale-[70%] brightness-75'
            }`}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-4">
        <h3 className="font-syne font-bold text-[22px] md:text-[26px] text-ftext">{p.title}</h3>
        <div className="font-mono text-[13px] md:text-[14px] text-muted uppercase md:text-right">{p.tag}</div>
      </div>
    </a>
  )
);
ProjectCard.displayName = 'ProjectCard';

/**
 * Projekte als Karussell.
 * Desktop: Der Bereich bleibt beim Scrollen stehen, die Karten ziehen seitlich
 * durch; die Karte in der Mitte ist groß und farbig, die Nachbarn kippen weg
 * (Coverflow). Mobil / reduzierte Bewegung: normales Wisch-Karussell mit Einrasten.
 */
const ProjectCarousel: React.FC<Props> = ({ projects, header }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Desktop: Scrollfortschritt -> seitliche Verschiebung + Coverflow je Karte
  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    let lastActive = -1;
    const update = () => {
      const outer = outerRef.current;
      const track = trackRef.current;
      const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
      if (outer && track && cards.length) {
        const r = outer.getBoundingClientRect();
        const scrollable = Math.max(1, r.height - window.innerHeight);
        const p = Math.min(1, Math.max(0, -r.top / scrollable));
        const vw = window.innerWidth;
        const firstC = cards[0].offsetLeft + cards[0].offsetWidth / 2;
        const lastC = cards[cards.length - 1].offsetLeft + cards[cards.length - 1].offsetWidth / 2;
        const x = vw / 2 - firstC - p * (lastC - firstC);
        track.style.transform = `translate3d(${x}px,0,0)`;

        let best = 0;
        let bestD = Infinity;
        cards.forEach((c, i) => {
          const d = (c.offsetLeft + c.offsetWidth / 2 + x - vw / 2) / c.offsetWidth;
          const ad = Math.min(Math.abs(d), 1.5);
          const tilt = Math.max(-1, Math.min(1, d)) * -24;
          // Nachbarn deutlich kleiner (~60 % bei einer Kartenbreite Abstand) und
          // ein Stück zur Mitte gezogen, damit durch das Schrumpfen keine Lücken entstehen.
          const scale = 1 - ad * 0.4;
          const pull = -Math.sign(d) * ad * c.offsetWidth * 0.14;
          c.style.transform = `translateX(${pull}px) perspective(1600px) rotateY(${tilt}deg) scale(${scale})`;
          c.style.opacity = String(1 - ad * 0.45);
          c.style.zIndex = String(100 - Math.round(ad * 10));
          if (Math.abs(d) < bestD) {
            bestD = Math.abs(d);
            best = i;
          }
        });
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        if (best !== lastActive) {
          lastActive = best;
          setActive(best);
        }
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [pinned]);

  // Mobil: aktive Karte aus der Wischposition ableiten
  const onSwipe = () => {
    const el = swipeRef.current;
    if (!el) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  };

  const total = String(projects.length).padStart(2, '0');
  const counter = (
    <span className="font-mono text-[14px] text-muted whitespace-nowrap">
      <span className="text-accent">{String(active + 1).padStart(2, '0')}</span> / {total}
    </span>
  );

  if (!pinned) {
    return (
      <div>
        <div className="px-6">{header}</div>
        <div
          ref={swipeRef}
          onScroll={onSwipe}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.href}
              ref={(el) => { cardRefs.current[i] = el; }}
              p={p}
              focused={i === active}
              className="w-[86vw] snap-center"
            />
          ))}
        </div>
        <div className="px-6 mt-6 flex items-center gap-4">
          {counter}
          <div className="flex gap-1.5">
            {projects.map((p, i) => (
              <span key={p.href} className={`h-1 transition-all duration-300 ${i === active ? 'w-6 bg-accent' : 'w-3 bg-line'}`} />
            ))}
          </div>
          <span className="ml-auto font-mono text-[13px] text-muted uppercase">Wischen →</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={outerRef} className="relative" style={{ height: `${projects.length * VH_PER_CARD + 70}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-16">
        <div className="px-12">{header}</div>
        <div ref={trackRef} className="relative flex items-start gap-[3vw] will-change-transform">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.href}
              ref={(el) => { cardRefs.current[i] = el; }}
              p={p}
              focused={i === active}
              className="will-change-transform"
              style={{ width: 'min(58vw, 860px, calc((100vh - 330px) * 1.85))' }}
            />
          ))}
        </div>
        <div className="px-12 mt-8 flex items-center gap-6">
          {counter}
          <div className="flex-1 h-px bg-line relative overflow-hidden">
            <div ref={barRef} className="absolute inset-0 bg-accent origin-left" style={{ transform: 'scaleX(0)' }} />
          </div>
          <span className="font-mono text-[13px] text-muted uppercase whitespace-nowrap">Weiterscrollen ↓</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
