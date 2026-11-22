import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { useSeen } from '../../hooks/useSeen';
import { dresden as t } from '../../content/dresden-copy';

const VoiceDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { seen, instant } = useSeen(ref, 0.6);
  const msgs = t.voice.chat;
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(-1);
  const [card, setCard] = useState(false);

  useEffect(() => {
    if (!seen) return;
    if (instant) {
      setShown(msgs.length);
      setTyping(-1);
      setCard(true);
      return;
    }
    // Auszahlung in unter 4 s: Blase 1 bei 0,3 s, Tippen 0,6 s, Blase 2 bei 1,2 s, Tippen 1,6 s, Blase 3 bei 2,2 s, Karte bei 3,4 s
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    at(300, () => setShown(1));
    at(600, () => setTyping(1));
    at(1200, () => { setTyping(-1); setShown(2); });
    at(1600, () => setTyping(2));
    at(2200, () => { setTyping(-1); setShown(3); });
    at(3400, () => setCard(true));
    return () => timers.forEach((x) => window.clearTimeout(x));
  }, [seen, instant, msgs]);

  const listening = typing >= 0 && msgs[typing].who === 'kunde';

  return (
    <div ref={ref} className="dd-chat relative rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 md:p-7 shadow-[0_40px_90px_-40px_rgba(20,40,140,0.6)]">
      <div className="flex items-center gap-3 mb-6">
        <span className="relative grid place-items-center w-10 h-10 shrink-0 rounded-full bg-[#3d5afe] text-white" aria-hidden="true">
          <span className="absolute inset-[-5px] rounded-full border border-[#3d5afe]/50" />
          <Mic className="w-[18px] h-[18px]" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-ftext">{t.voice.demoTitle}</div>
          <div className="text-[13px] text-muted">{t.voice.demoLabel}</div>
        </div>
        <span className={`dd-wave ${listening ? 'live' : ''}`} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((b) => (
            <span key={b} style={{ '--b': b } as React.CSSProperties} />
          ))}
        </span>
      </div>
      <div className="space-y-3 pb-10">
        {msgs.map((m, i) => (
          <div key={i} className={`relative flex ${m.who === 'ki' ? 'justify-start' : 'justify-end'}`}>
            <p
              className={`dd-msg max-w-[88%] m-0 rounded-[16px] px-4 py-3 text-[15px] leading-[1.5] ${i < shown ? 'on' : ''} ${
                m.who === 'ki' ? 'bg-white/[0.06] text-ftext rounded-tl-[4px]' : 'bg-[#3d5afe]/[0.22] text-ftext rounded-tr-[4px]'
              }`}
            >
              <span className="sr-only">{m.who === 'ki' ? 'KI-Assistentin: ' : 'Kundin: '}</span>
              {m.text}
            </p>
            {typing === i && (
              <span
                aria-hidden="true"
                className={`dd-typing absolute top-0 inline-flex items-center gap-1.5 rounded-[16px] px-4 py-[15px] ${
                  m.who === 'ki' ? 'left-0 bg-white/[0.06] rounded-tl-[4px]' : 'right-0 bg-[#3d5afe]/[0.22] rounded-tr-[4px]'
                }`}
              >
                <i /><i /><i />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={`dd-order relative z-[1] -mt-8 rounded-[16px] bg-white text-[#0a0e1a] p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ${card ? 'on' : ''}`}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.12em]">{t.voice.card.number}</span>
          <span className="dd-urgent inline-flex items-center gap-1.5 rounded-full bg-[#e5484d] text-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em]">
            <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
            {t.voice.card.badge}
          </span>
        </div>
        <dl className="divide-y divide-[#e6e9f0] m-0">
          {t.voice.card.rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[96px_1fr] gap-3 py-2.5 text-[15px]">
              <dt className="text-[#5b6478]">{k}</dt>
              <dd className="m-0 font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default VoiceDemo;
