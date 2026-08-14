import React, { useEffect, useRef } from 'react';

/**
 * Hero-Hintergrund: eine driftende Wand aus echten Kundenseiten,
 * die in einem gerenderten Studioraum steht. Drei Tiefenebenen,
 * jede langsamer und dunkler als die davor.
 *
 * Zeichnet auf ein einzelnes Canvas (~90 KB Bilder, kein Video).
 * Steht still bei prefers-reduced-motion, auf Mobil und sobald
 * der Hero aus dem Viewport gescrollt ist.
 */

const WALL = ['muaythai', 'dance', 'colombina', 'k1', 'squash'];

type Row = { wf: number; y: number; speed: number; dim: number; idx: number };

const ROWS_WIDE: Row[] = [
  { wf: 0.125, y: 0.11, speed: 0.0092, dim: 0.66, idx: 0 },
  { wf: 0.170, y: 0.45, speed: 0.0158, dim: 0.46, idx: 2 },
  { wf: 0.225, y: 0.78, speed: 0.0245, dim: 0.26, idx: 4 },
];

/**
 * Hochkant ist das Fenster schmal und sehr hoch: dieselben drei Reihen
 * ergäben ein paar riesige Rechtecke, von denen eins hinter der Headline
 * steht. Stattdessen vier schmalere Reihen, die das mittlere Drittel
 * (0.28–0.70) komplett für den Text frei lassen.
 */
const ROWS_NARROW: Row[] = [
  { wf: 0.075, y: 0.06, speed: 0.0085, dim: 0.70, idx: 0 },
  { wf: 0.098, y: 0.20, speed: 0.0140, dim: 0.56, idx: 2 },
  { wf: 0.120, y: 0.78, speed: 0.0200, dim: 0.42, idx: 1 },
  { wf: 0.150, y: 0.92, speed: 0.0270, dim: 0.30, idx: 3 },
];

const NARROW_MAX = 767;

const STILL_FRAME = 4200;

const HeroBackdrop: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const load = (src: string) => {
      const im = new Image();
      im.decoding = 'async';
      im.src = src;
      return im;
    };
    const plate = load('/hero/backplate.webp');
    const shots = WALL.map((n) => load(`/hero/wall/${n}.webp`));
    const all = [plate, ...shots];
    const ready = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const still = reduce || window.matchMedia('(max-width: 767px)').matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let onScreen = true;
    let alive = true;

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
      } else {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
      }
    };

    const drawWindow = (
      img: HTMLImageElement,
      x: number,
      y: number,
      w: number,
      h: number,
      ch: number,
      dim: number,
      alpha: number
    ) => {
      if (x > W + w || x < -w * 2) return;
      const bar = h - ch;
      const dot = Math.max(1.6, bar * 0.11);
      const pad = Math.max(3, w * 0.008);

      ctx.save();
      ctx.globalAlpha = alpha;

      ctx.shadowColor = 'rgba(0,0,0,.6)';
      ctx.shadowBlur = w * 0.1;
      ctx.shadowOffsetY = w * 0.03;
      rr(x, y, w, h, w * 0.022);
      ctx.fillStyle = '#15191b';
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.save();
      rr(x, y, w, bar, w * 0.022);
      ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,.055)';
      ctx.fillRect(x, y, w, bar);
      ctx.restore();

      for (let d = 0; d < 3; d++) {
        ctx.beginPath();
        ctx.arc(x + bar * 0.5 + d * bar * 0.42, y + bar / 2, dot, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.22)';
        ctx.fill();
      }

      ctx.save();
      rr(x + pad, y + bar, w - pad * 2, ch - pad, w * 0.012);
      ctx.clip();
      ctx.drawImage(img, x + pad, y + bar, w - pad * 2, ch - pad);
      if (dim > 0) {
        ctx.fillStyle = `rgba(8,9,10,${dim})`;
        ctx.fillRect(x + pad, y + bar, w - pad * 2, ch - pad);
      }
      ctx.restore();

      rr(x, y, w, h, w * 0.022);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.12)';
      ctx.stroke();
      ctx.restore();
    };

    const wall = (t: number, alpha: number) => {
      const first = shots[0];
      if (!ready(first)) return;
      const aspect = first.naturalHeight / first.naturalWidth;

      const narrow = W <= NARROW_MAX;
      const rows = narrow ? ROWS_NARROW : ROWS_WIDE;

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(narrow ? -0.06 : -0.088);
      ctx.translate(-W / 2, -H / 2);

      // Fensterbreite an einer festen Basis messen, nicht am Viewport: sonst
      // laufen auf schmalen Screens alle Reihen in dieselbe Größe und die
      // Tiefenstaffelung geht verloren.
      const unit = narrow ? 1250 : Math.max(W, 900);

      for (const row of rows) {
        const w = unit * row.wf;
        const ch = w * aspect;
        const h = ch + Math.max(14, w * 0.055);
        const period = w + w * 0.2;
        const startX = -period - W * 0.28 - ((t * row.speed) % period);
        const count = Math.ceil((W * 1.56 + period * 2) / period);
        const y = H * row.y - h / 2;

        for (let i = 0; i < count; i++) {
          const img = shots[(i + row.idx) % shots.length];
          if (!ready(img)) continue;
          drawWindow(img, startX + i * period, y, w, h, ch, row.dim, alpha);
        }
      }
      ctx.restore();
    };

    /**
     * Quer: klassisches Cover. Hochkant NICHT — ein 16:9-Bild auf ein 9:19-
     * Fenster gecovert zeigt nur noch rund ein Viertel der Bildbreite, der
     * Lichtstrahl wird dabei so weit hochgezoomt, dass er als flächiger
     * Teal-Nebel ankommt statt als Strahl. Deshalb hochkant auf Breite
     * einpassen, oben verankern und nach unten ins Dunkle auslaufen lassen.
     */
    const cover = (img: HTMLImageElement, t: number, amp: number, speed: number) => {
      if (!ready(img)) return;
      const drift = Math.sin(t * speed * 0.7) * amp;
      const breathe = 1.05 + 0.035 * Math.sin(t * speed);

      if (W <= NARROW_MAX) {
        const s = (W / img.naturalWidth) * (1.14 + 0.03 * Math.sin(t * speed));
        const w = img.naturalWidth * s;
        const h = img.naturalHeight * s;
        const y = -h * 0.04;
        ctx.drawImage(img, (W - w) / 2 + drift * 0.4, y, w, h);

        const from = y + h * 0.62;
        const g = ctx.createLinearGradient(0, from, 0, y + h);
        g.addColorStop(0, 'rgba(8,9,10,0)');
        g.addColorStop(1, '#08090a');
        ctx.fillStyle = g;
        ctx.fillRect(0, from, W, H - from);
        return;
      }

      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * breathe;
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(
        img,
        (W - w) / 2 + drift,
        (H - h) / 2 + Math.cos(t * speed * 0.55) * amp * 0.5,
        w,
        h
      );
    };

    const frame = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Solange die Platte fehlt, gar nichts zeichnen: ein deckendes Schwarz
      // würde den Verlauf der Seite überdecken und den Hero flacher machen
      // als ohne diese Komponente. Lieber durchsichtig bleiben und einblenden.
      if (!ready(plate)) {
        ctx.clearRect(0, 0, W, H);
        return;
      }
      host.style.opacity = '1';

      ctx.fillStyle = '#08090a';
      ctx.fillRect(0, 0, W, H);

      cover(plate, t, 26, 0.00006);
      ctx.fillStyle = 'rgba(8,9,10,.30)';
      ctx.fillRect(0, 0, W, H);

      wall(t, 0.8);

      // Lichtschaft der Platte noch einmal über die Wand legen, damit die
      // Fenster im Strahl stehen statt nur davorzukleben
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.3;
      cover(plate, t, 26, 0.00006);
      ctx.restore();

      const tint = ctx.createLinearGradient(0, 0, W * 0.7, H);
      tint.addColorStop(0, 'rgba(6,182,212,.09)');
      tint.addColorStop(1, 'rgba(8,9,10,0)');
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, W, H);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      if (still) frame(STILL_FRAME);
    };

    const loop = (now: number) => {
      if (!alive || still || !onScreen || document.hidden) return;
      frame(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (still || raf) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 }
    );

    // Beim Laden nachziehen: im Standbild-Modus gibt es keine Schleife,
    // die das fehlende Bild von selbst nachreicht.
    const redraw = () => {
      if (still) frame(STILL_FRAME);
    };
    all.forEach((im) => im.addEventListener('load', redraw));

    resize();
    observer.observe(host);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      alive = false;
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      all.forEach((im) => im.removeEventListener('load', redraw));
    };
  }, []);

  const fade =
    'linear-gradient(to bottom, black 0%, black 52%, rgba(0,0,0,.34) 82%, transparent 99%)';

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-700 ease-out"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ WebkitMaskImage: fade, maskImage: fade }}
      />
      {/* Scrim hinter der Textsäule — hält die Copy lesbar, egal was drunter
          driftet. Quer ein Oval um den Textblock, hochkant ein Band über die
          volle Breite: dort steht der Text randlos und ein Oval träfe ihn nicht. */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'radial-gradient(46% 34% at 50% 50%, rgba(8,9,10,.82) 0%, rgba(8,9,10,.55) 45%, rgba(8,9,10,0) 100%)',
        }}
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,9,10,.30) 0%, rgba(8,9,10,.62) 24%, rgba(8,9,10,.84) 44%, rgba(8,9,10,.84) 66%, rgba(8,9,10,.76) 84%, rgba(8,9,10,.68) 100%)',
        }}
      />
    </div>
  );
};

export default HeroBackdrop;
