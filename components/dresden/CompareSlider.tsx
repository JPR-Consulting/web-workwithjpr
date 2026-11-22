import React, { useEffect, useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { useSeen } from '../../hooks/useSeen';
import { dresden as t } from '../../content/dresden-copy';

/**
 * Gestaltete Attrappe einer typischen älteren Handwerker-Seite (erfundener Name, keine echte Firma):
 * grau, eng, kleine Schrift, Telefonnummer nur als Text. Feste Entwurfsgröße 1200 × 750, skaliert auf die Breite des Rahmens.
 */
const OldSiteMock: React.FC<{ scale: number; height?: number }> = ({ scale, height = 750 }) => {
  const nav = ['Startseite', 'Über uns', 'Leistungen', 'Kontakt', 'Impressum'];
  const bar = (w: number, key: number) => <div key={key} style={{ height: 7, width: `${w}%`, background: '#bdbdbd', marginBottom: 7 }} />;
  return (
    <div
      aria-hidden="true"
      style={{
        width: 1200,
        height,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        background: '#e4e4e4',
        fontFamily: "'Times New Roman', Times, serif",
        color: '#444',
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'none',
      }}
    >
      <div style={{ background: '#6b7b92', padding: '14px 28px', borderBottom: '3px solid #4f5d72' }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: 0 }}>{t.beforeAfter.mockName}</div>
        <div style={{ marginTop: 6 }}>{bar(30, 0)}</div>
      </div>
      <div style={{ background: '#cfcfcf', padding: '6px 28px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 12, color: '#1a0dab', borderBottom: '1px solid #aaa' }}>
        {nav.map((n, i) => (
          <span key={n}>
            {i > 0 && <span style={{ color: '#777', margin: '0 8px' }}>|</span>}
            <span style={{ textDecoration: 'underline' }}>{n}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, padding: '20px 28px' }}>
        <div style={{ width: 170, flex: 'none', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 11, color: '#1a0dab', background: '#d9d9d9', border: '1px solid #b5b5b5', padding: 10, lineHeight: 1.9 }}>
          {['Heizung', 'Sanitär', 'Bad', 'Solar', 'Wartung', 'Links'].map((x) => (
            <div key={x} style={{ textDecoration: 'underline' }}>&raquo; {x}</div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#333', marginBottom: 12 }}>Herzlich willkommen!</div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <div style={{ width: 210, height: 130, flex: 'none', background: '#c4c4c4', border: '1px solid #9d9d9d', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, transparent calc(50% - 1px), #a3a3a3 50%, transparent calc(50% + 1px))' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top left, transparent calc(50% - 1px), #a3a3a3 50%, transparent calc(50% + 1px))' }} />
            </div>
            <div style={{ flex: 1 }}>{[100, 96, 99, 90, 100, 82, 94, 60].map(bar)}</div>
          </div>
          {[100, 97, 100, 92, 99, 100, 88, 96, 100, 70].map((w, i) => bar(w, i + 20))}
          <div style={{ fontSize: 15, fontWeight: 700, margin: '14px 0 8px', color: '#555' }}>Unsere Leistungen</div>
          {[98, 100, 90, 100, 96, 64].map((w, i) => bar(w, i + 40))}
          {height > 800 &&
            [0, 1, 2].map((k) => (
              <div key={k} style={{ marginTop: 22 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  {[0, 1, 2].map((c) => (
                    <div key={c} style={{ flex: 1, height: 120, background: '#cdcdcd', border: '1px solid #a8a8a8' }} />
                  ))}
                </div>
                {[100, 94, 98, 86, 100, 72].map((w, i) => bar(w, 60 + k * 10 + i))}
              </div>
            ))}
        </div>
        <div style={{ width: 200, flex: 'none', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 11, color: '#555', background: '#d9d9d9', border: '1px solid #b5b5b5', padding: 10, lineHeight: 1.7, alignSelf: 'flex-start' }}>
          <div style={{ fontWeight: 700 }}>{t.beforeAfter.mockName}</div>
          <div>Tel. 0351 000 00 00</div>
          <div>Mo bis Fr 8 bis 16 Uhr</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#cfcfcf', borderTop: '1px solid #aaa', padding: '8px 28px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, color: '#666', textAlign: 'right' }}>
        <span style={{ textDecoration: 'underline', color: '#1a0dab' }}>Impressum</span> | <span style={{ textDecoration: 'underline', color: '#1a0dab' }}>Datenschutz</span> | &copy; 2009 {t.beforeAfter.mockName}
      </div>
    </div>
  );
};

/**
 * Vorher/Nachher-Regler: links die Attrappe „Ihre Seite heute“, rechts der Beispiel-Entwurf. Ziehen mit Maus/Finger,
 * Tastatur: Pfeile ±5, Bild auf/ab ±20, Pos1/Ende. Beim Erscheinen schiebt sich der Regler einmal von rechts in die Mitte.
 */
const CompareSlider: React.FC = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const { seen, instant } = useSeen(wrap, 0.5);
  // v = Anteil der Attrappe („Ihre Seite heute“) von rechts in %. Ruhelage 35: zwei Drittel des Entwurfs sind sichtbar, mit Überschrift und Knopf.
  const [v, setV] = useState(35);
  const [drag, setDrag] = useState(false);
  const [box, setBox] = useState({ w: 600, h: 375, narrow: false });
  const touched = useRef(false);

  useEffect(() => {
    if (!seen || instant || touched.current) return;
    // einmaliger Hinweis: Regler gleitet 35 → 60 → 35
    const a = window.setTimeout(() => !touched.current && setV(60), 250);
    const b = window.setTimeout(() => !touched.current && setV(35), 1750);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [seen, instant]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight, narrow: window.matchMedia('(max-width: 767px)').matches });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Gleicher Maßstab auf beiden Seiten: Desktop 1200-px-Raster auf Rahmenbreite, Handy: verkleinerte Desktop-Seite (0,38)
  const scale = box.narrow ? 0.38 : box.w / 1200;
  const mockH = box.narrow ? Math.ceil(box.h / scale) : 750;

  const setFromX = (clientX: number) => {
    const r = wrap.current!.getBoundingClientRect();
    touched.current = true;
    setV(Math.min(100, Math.max(0, ((r.right - clientX) / r.width) * 100)));
  };
  const nudge = (d: number) => {
    touched.current = true;
    setV((p) => Math.min(100, Math.max(0, p + d)));
  };
  // Pfeil links/rechts bewegt den Griff in diese Richtung
  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowDown') nudge(5);
    else if (k === 'ArrowRight' || k === 'ArrowUp') nudge(-5);
    else if (k === 'PageDown') nudge(20);
    else if (k === 'PageUp') nudge(-20);
    else if (k === 'Home') { touched.current = true; setV(100); }
    else if (k === 'End') { touched.current = true; setV(0); }
    else return;
    e.preventDefault();
  };

  const glide = !drag ? 'transition-[clip-path,left] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : '';

  return (
    <div
      ref={wrap}
      className="dd-compare relative w-full max-w-[calc(70svh*9/16)] mx-auto md:max-w-none aspect-[9/16] md:aspect-[16/10] rounded-[18px] md:rounded-[22px] overflow-hidden bg-[#0b0f19] select-none touch-pan-y cursor-ew-resize shadow-[0_40px_90px_-40px_rgba(20,40,140,0.55)] ring-1 ring-black/10"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(true);
        setFromX(e.clientX);
      }}
      onPointerMove={(e) => drag && setFromX(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
    >
      {/* Nachher: Beispiel-Entwurf, links oben ausgerichtet (Handy-Bild auf dem Handy) */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/dresden/beispiel-shk-mobile.webp" />
        <img
          src="/dresden/beispiel-shk-desktop.webp"
          alt={`${t.examples.badge}: ${t.examples.items[0].title}`}
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-left-top"
        />
      </picture>
      <span className="absolute left-3 bottom-3 md:left-4 md:bottom-4 z-[1] inline-flex items-center rounded-full bg-[#3d5afe] px-3.5 py-1.5 text-[13px] font-bold text-white shadow-lg whitespace-nowrap">
        {t.beforeAfter.sliderAfter}
      </span>

      {/* Vorher: Attrappe, nur der rechte Teil (v %) */}
      <div className={`absolute inset-0 bg-[#e4e4e4] ${glide}`} style={{ clipPath: `inset(0 0 0 ${100 - v}%)` }}>
        <div role="img" aria-label={t.ui.mockAlt} className="absolute inset-0 overflow-hidden">
          <OldSiteMock scale={scale} height={mockH} />
        </div>
        <span className="absolute right-3 bottom-3 md:right-4 md:bottom-4 z-[1] inline-flex items-center rounded-full bg-[#2a2f3a] px-3.5 py-1.5 text-[13px] font-bold text-white shadow-lg whitespace-nowrap">
          {t.beforeAfter.sliderBefore}
        </span>
      </div>

      {/* Griff */}
      <div className={`absolute top-0 bottom-0 z-[2] w-0 ${glide}`} style={{ left: `${100 - v}%` }}>
        <span className="absolute inset-y-0 -left-px w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_0_24px_rgba(61,90,254,0.6)]" aria-hidden="true" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={t.ui.sliderLabel}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(v)}
          aria-valuetext={`${t.beforeAfter.sliderBefore}: ${Math.round(v)} %`}
          onKeyDown={onKey}
          className="dd-handle absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-12 h-12 rounded-full bg-white text-[#3d5afe] shadow-[0_10px_30px_-6px_rgba(10,20,60,0.6)] ring-4 ring-[#3d5afe]/30"
        >
          <ChevronsLeftRight className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default CompareSlider;
