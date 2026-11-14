import React, { useEffect, useRef, useState } from 'react';
import { useCopy } from '../i18n';

/**
 * Kundenprojekt Subyen direkt unter dem Hero: beim Scrollen wischt die heutige Seite
 * (echtes Video) über die Seite von 2018, danach zählt der Zähler hoch und drei
 * Buchungs-Meldungen kommen rein. Ohne JavaScript-Zustand, bei "Bewegung reduzieren"
 * und vor dem ersten Scroll steht der Endzustand.
 *
 * Kein GSAP: der Abschnitt ist hoch, die Bühne darin klebt (position: sticky), und ein
 * rAF-Loop rechnet aus der Scroll-Position den Fortschritt. Läuft nur, solange der
 * Abschnitt in der Nähe des Bildschirms ist.
 */

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const out2 = (x: number) => 1 - (1 - x) * (1 - x);
const out3 = (x: number) => 1 - Math.pow(1 - x, 3);

const MEDIA = '/case/subyen';

const SubyenCase: React.FC = () => {
  const all = useCopy();
  const t = all.caseStudy;
  const quote = all.testimonials.items.find((i) => i.name === t.person);

  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const notifRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrub, setScrub] = useState(false);

  // Bewegung nur, wenn der Nutzer sie nicht abgeschaltet hat.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setScrub(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Video erst laden, wenn der Abschnitt näher kommt; nur abspielen, solange sichtbar.
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid || !scrub) return;
    const phone = window.matchMedia('(max-width: 767px)').matches;
    const src = `${MEDIA}/subyen-heute-${phone ? 'phone' : 'desktop'}.mp4`;
    const tryPlay = () => { vid.play()?.catch(() => {}); };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!vid.getAttribute('src')) vid.setAttribute('src', src);
            tryPlay();
          } else {
            vid.pause();
          }
        });
      },
      { rootMargin: '50% 0px' },
    );
    io.observe(vid);
    return () => io.disconnect();
  }, [scrub]);

  // Scroll → Fortschritt → CSS-Variablen (kein React-Render pro Frame).
  useEffect(() => {
    const sec = secRef.current;
    const stage = stageRef.current;
    if (!sec || !stage) return;

    const paint = (tl: number) => {
      const scan = tl < 0.58 ? seg(tl, 0.02, 0.05) : 1 - seg(tl, 0.58, 0.62);
      stage.style.setProperty('--p', inOut(seg(tl, 0.04, 0.6)).toFixed(4));
      stage.style.setProperty('--scan', scan.toFixed(3));
      stage.style.setProperty('--o-old', (1 - seg(tl, 0.55, 0.6)).toFixed(3));
      stage.style.setProperty('--o-new', seg(tl, 0.59, 0.64).toFixed(3));
      notifRefs.current.forEach((n, i) => {
        if (n) n.style.setProperty('--n', out3(seg(tl, 0.64 + i * 0.08, 0.71 + i * 0.08)).toFixed(3));
      });
      if (countRef.current) countRef.current.textContent = String(Math.round(t.count * out2(seg(tl, 0.64, 0.92))));
    };

    if (!scrub) {
      // Endzustand
      ['--p', '--scan', '--o-old', '--o-new'].forEach((v) => stage.style.removeProperty(v));
      notifRefs.current.forEach((n) => n?.style.removeProperty('--n'));
      if (countRef.current) countRef.current.textContent = String(t.count);
      return;
    }

    let target = 0;
    let cur = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      const travel = sec.offsetHeight - stage.offsetHeight;
      target = travel > 0 ? clamp(-sec.getBoundingClientRect().top / travel) : 1;
    };
    const tick = () => {
      measure();
      cur += (target - cur) * 0.16;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      paint(cur);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    measure();
    cur = target;
    paint(cur);

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: '20% 0px' },
    );
    io.observe(sec);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [scrub, t.count]);

  return (
    <>
      <section ref={secRef} className={`cs-sec ${scrub ? 'is-scrub' : ''}`} aria-labelledby="cs-h">
        <div ref={stageRef} className="cs-stage">
          <div className="cs-head">
            <p className="cs-kicker">{t.kicker}</p>
            <h2 id="cs-h" className="cs-title">
              {t.title.map((w, i) => (
                <React.Fragment key={w}>
                  {i > 0 && ' '}
                  <span className="cs-w">{w}</span>
                </React.Fragment>
              ))}
            </h2>
          </div>

          <div className="cs-wrap">
            <div className="cs-frame">
              <div className="cs-bar">
                <span className="cs-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="cs-url">{t.url}</span>
              </div>
              <div className="cs-view">
                <div className="cs-layer">
                  <img className="cs-shot" src={`${MEDIA}/subyen-2018-desktop.webp`} width={1800} height={1153} alt={t.altOld} loading="lazy" decoding="async" />
                </div>
                <div className="cs-layer cs-layer-new">
                  <video
                    ref={vidRef}
                    className="cs-shot"
                    muted
                    playsInline
                    loop
                    preload="none"
                    poster={`${MEDIA}/subyen-heute-poster.webp`}
                    aria-label={t.altNew}
                  />
                </div>
                <div className="cs-scan" aria-hidden="true">
                  <span className="cs-tag cs-tag-l">{t.tagNew}</span>
                  <span className="cs-tag cs-tag-r">{t.tagOld}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cs-side">
            <div className="cs-states">
              <p className="cs-old">{t.old}</p>
              <p className="cs-new">{t.now}</p>
            </div>
            <div className="cs-counter">
              <span className="cs-num" ref={countRef}>{t.count}</span>
              <span className="cs-lab">{t.countLabel}<small>{t.countNote}</small></span>
            </div>
            <div className="cs-notifs" role="list" aria-label={t.notifLabel}>
              {t.notifSlots.map((slot, i) => (
                <div key={slot} role="listitem" className="cs-notif" ref={(el) => { notifRefs.current[i] = el; }}>
                  <span className="cs-ico" aria-hidden="true">MT</span>
                  <span className="cs-ntop">{t.notifTop}</span>
                  <span className="cs-when">{t.notifWhen}</span>
                  <span className="cs-nmain"><b>{t.notifClass}</b> <span>· {slot}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {quote && (
        <section className="px-6 md:px-12 border-b border-line pt-14 pb-16 md:pt-16 md:pb-20" aria-label={all.testimonials.eyebrow}>
          <figure className="m-0 max-w-[900px]">
            <blockquote className="m-0 font-body text-[22px] leading-[1.45] lg:text-[34px] lg:leading-[1.3] lg:-indent-[0.4em] text-ftext">
              &bdquo;{quote.quote}&ldquo;
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-muted">
              <span className="inline-block w-[22px] h-px bg-accent" aria-hidden="true" />
              <b className="font-medium text-ftext">{quote.name}</b>
              <span>{quote.company}</span>
            </figcaption>
            {t.quoteNote && <p className="mt-3 text-[14px] text-muted">{t.quoteNote}</p>}
          </figure>
          <p className="mt-10 font-mono text-[12px] text-dim">{t.source}</p>
        </section>
      )}
    </>
  );
};

export default SubyenCase;
