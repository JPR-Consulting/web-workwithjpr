import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useCopy, useLang } from '../i18n';
import { attributionLine } from '../attribution';
import { trackEvent, trackLead } from '../tracking';

/**
 * „Kostenloser Entwurf in 48 Stunden“: Website-Adresse + 4 kurze Fragen, ganz ohne Termin.
 * Geht an die bestehende Kontakt-Automatik auf dem JPR-n8n (Workflow „Web-WorkWithJPR Contact
 * Form“): Jan bekommt eine Mail, der Interessent eine Bestätigung. Branche, Ziele und Notiz
 * landen im Feld `message`, weil der Workflow genau diese Felder kennt.
 */
const WEBHOOK_URL = 'https://n8n.workwithjpr.com/webhook/web-workwithjpr';
const MAIL = 'info@workwithjpr.com';
const TOTAL = 4;

interface Props {
  open: boolean;
  /** Aus dem Hero-Feld übernommen, kann leer sein. */
  initialWebsite: string;
  onClose: () => void;
  onCall: () => void;
  /** Index in q2.options, der beim Öffnen vorgewählt wird (z. B. Handwerk = 2). */
  presetIndustry?: number;
  /** Wird an `source` angehängt, z. B. „lp-handwerk“. */
  sourceTag?: string;
}

type Errors = Partial<Record<'company' | 'industry' | 'name' | 'email', string>>;

const EMPTY = { company: '', website: '', industry: -1, goals: [] as number[], note: '', name: '', email: '', phone: '', website2: '' };

// Namen der vier Schritte für die Messung (Reihenfolge wie im Formular)
const STEP_NAMES = ['betrieb', 'branche', 'ziele', 'kontakt'];

const fieldClass = (invalid: boolean) =>
  `w-full h-14 px-4 bg-panel border ${invalid ? 'border-[#ff7a7a]' : 'border-line'} text-ftext text-[17px] font-body placeholder:text-dim transition-colors focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`;

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block font-mono text-[13px] uppercase text-muted mb-2">
    {children}
  </label>
);

const FieldError: React.FC<{ id: string; text?: string }> = ({ id, text }) =>
  text ? <p id={id} className="mt-2 text-[15px] text-[#ff9a9a]">{text}</p> : null;

/** Radio- oder Checkbox-Kachel; das echte Eingabeelement bleibt für Tastatur und Screenreader erhalten. */
const Choice: React.FC<{ type: 'radio' | 'checkbox'; name: string; label: string; checked: boolean; onChange: () => void; describedBy?: string }> = ({
  type, name, label, checked, onChange, describedBy,
}) => (
  <label
    className={`flex items-center gap-3 min-h-[56px] px-4 py-3 border cursor-pointer transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
      checked ? 'border-accent bg-accent/10 text-ftext' : 'border-line bg-panel text-ftext hover:border-[#4a4a52]'
    }`}
  >
    <input type={type} name={name} checked={checked} onChange={onChange} aria-describedby={describedBy} className="sr-only" />
    <span
      aria-hidden="true"
      className={`grid place-items-center w-5 h-5 shrink-0 border ${type === 'radio' ? 'rounded-full' : ''} ${checked ? 'bg-accent border-accent' : 'border-[#5a5a62]'}`}
    >
      {checked && <Check className="w-3.5 h-3.5 text-ink" strokeWidth={3} />}
    </span>
    <span className="text-[17px] leading-snug">{label}</span>
  </label>
);

const DraftDialog: React.FC<Props> = ({ open, initialWebsite, onClose, onCall, presetIndustry, sourceTag }) => {
  const t = useCopy().draft;
  const lang = useLang();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'form' | 'sending' | 'done' | 'error'>('form');

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Öffnen/Schließen am echten <dialog>, Seite dahinter festhalten.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open) {
      if (status === 'done') {
        setData(EMPTY);
        setStatus('form');
      }
      setStep(1);
      setErrors({});
      if (presetIndustry !== undefined) setData((d) => (d.industry < 0 ? { ...d, industry: presetIndustry } : d));
      if (initialWebsite) setData((d) => ({ ...d, website: initialWebsite }));
      if (!dlg.open) dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
      trackEvent('form_open', { form: 'entwurf', source: sourceTag || 'start' }, 'EntwurfGeoeffnet');
    } else if (dlg.open) {
      dlg.close();
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Bei jedem Schritt das erste Feld fokussieren.
  useEffect(() => {
    if (!open) return;
    const first = bodyRef.current?.querySelector<HTMLElement>('input:checked, input:not([type=hidden]):not([tabindex="-1"]), textarea, button');
    first?.focus();
  }, [step, status, open]);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 1 && data.company.trim().length < 2) e.company = t.errors.company;
    if (s === 2 && data.industry < 0) e.industry = t.errors.industry;
    if (s === 4) {
      if (data.name.trim().length < 2) e.name = t.errors.name;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = t.errors.email;
    }
    return e;
  };

  const submit = async () => {
    setStatus('sending');
    const goals = data.goals.map((i) => t.q3.options[i]).join(', ');
    const message = [
      `Anfrage: kostenloser Entwurf in 48 Stunden (${lang.toUpperCase()})`,
      `Branche: ${t.q2.options[data.industry] ?? '–'}`,
      `Ziele: ${goals || '–'}`,
      data.note.trim() ? `Notiz: ${data.note.trim()}` : '',
      attributionLine(),
    ].filter(Boolean).join('\n');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          company: data.company.trim(),
          website: data.website.trim(),
          message,
          timestamp: new Date().toISOString(),
          source: `workwithjpr.com · Entwurf-Formular${sourceTag ? ` · ${sourceTag}` : ''}`,
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        setStatus('done');
        trackLead();
        return;
      }
    } catch {
      /* unten */
    }
    setStatus('error');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (data.website2) return; // Bot-Falle
    const found = validate(step);
    setErrors(found);
    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0];
      bodyRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`)?.focus();
      return;
    }
    if (step < TOTAL) {
      trackEvent('form_step', { form: 'entwurf', step: step + 1, step_name: STEP_NAMES[step] }, 'EntwurfSchritt');
      setStep(step + 1);
    } else void submit();
  };

  // Schließen ohne Absenden messen: an welchem Schritt steigen die Leute aus?
  const close = () => {
    if (status !== 'done') trackEvent('form_close', { form: 'entwurf', step, step_name: STEP_NAMES[step - 1] }, 'EntwurfAbgebrochen');
    onClose();
  };

  const firstName = data.name.trim().split(/\s+/)[0] ?? '';

  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent
      aria-labelledby="draft-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      className="draft-dialog m-0 md:m-auto p-0 w-full h-[100dvh] max-w-none max-h-none md:w-[600px] md:h-fit md:max-h-[calc(100dvh-48px)] bg-ink text-ftext font-body md:border md:border-line"
    >
      <div className="flex flex-col h-full md:max-h-[calc(100dvh-48px)]">
        {/* Kopf */}
        <div className="flex items-center justify-between gap-4 pl-6 md:pl-8 pr-3 pt-3">
          <div className="font-mono text-[13px] uppercase">
            <span className="text-accent">{t.eyebrow}</span>
            {status !== 'done' && (
              <span className="text-muted"> · {t.step.replace('{n}', String(step)).replace('{total}', String(TOTAL))}</span>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className="grid place-items-center w-11 h-11 text-muted hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-1 px-6 md:px-8 mt-2" aria-hidden="true">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className={`h-[3px] flex-1 transition-colors duration-300 ${status === 'done' || i < step ? 'bg-accent' : 'bg-line'}`} />
          ))}
        </div>

        {status === 'done' ? (
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 md:px-8 py-10">
            <div className="grid place-items-center w-14 h-14 bg-accent text-ink mb-7" aria-hidden="true">
              <Check className="w-7 h-7" strokeWidth={3} />
            </div>
            <h2 id="draft-title" className="font-syne font-extrabold uppercase text-[clamp(28px,5vw,38px)] leading-[1.05] tracking-[-0.01em] mb-4">
              {t.success.title.replace('{name}', firstName)}
            </h2>
            <p className="text-[18px] leading-[1.6] text-ftext/85 mb-9 max-w-[460px]">
              {t.success.text.replace('{email}', data.email.trim())}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center font-mono text-[14px] font-medium uppercase bg-accent text-ink px-7 h-12 border border-accent hover:bg-transparent hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t.success.close}
              </button>
              <button type="button" onClick={onCall} className="text-[16px] text-muted hover:text-accent transition-colors underline underline-offset-4">
                {t.success.call}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col flex-1 min-h-0">
            <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-8">
              {/* Unsichtbare Bot-Falle */}
              <input
                type="text"
                name="website2"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={data.website2}
                onChange={(e) => set('website2', e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />

              {step === 1 && (
                <>
                  <h2 id="draft-title" className="font-syne font-extrabold uppercase text-[clamp(26px,5vw,34px)] leading-[1.05] tracking-[-0.01em] mb-7">{t.q1.title}</h2>
                  <div className="mb-6">
                    <Label htmlFor="draft-company">{t.q1.company}</Label>
                    <input
                      id="draft-company"
                      data-field="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={t.q1.companyPlaceholder}
                      value={data.company}
                      onChange={(e) => set('company', e.target.value)}
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? 'draft-company-error' : undefined}
                      className={fieldClass(!!errors.company)}
                    />
                    <FieldError id="draft-company-error" text={errors.company} />
                  </div>
                  <div>
                    <Label htmlFor="draft-website">{t.q1.website}</Label>
                    <input
                      id="draft-website"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder={t.heroPlaceholder}
                      value={data.website}
                      onChange={(e) => set('website', e.target.value)}
                      aria-describedby="draft-website-hint"
                      className={fieldClass(false)}
                    />
                    <p id="draft-website-hint" className="mt-2 text-[15px] text-dim">{t.q1.websiteHint}</p>
                  </div>
                </>
              )}

              {step === 2 && (
                <fieldset aria-describedby={errors.industry ? 'draft-industry-error' : undefined}>
                  <legend id="draft-title" className="font-syne font-extrabold uppercase text-[clamp(26px,5vw,34px)] leading-[1.05] tracking-[-0.01em] mb-7">{t.q2.title}</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" data-field="industry" tabIndex={-1}>
                    {t.q2.options.map((o, i) => (
                      <Choice key={o} type="radio" name="industry" label={o} checked={data.industry === i} onChange={() => set('industry', i)} />
                    ))}
                  </div>
                  <FieldError id="draft-industry-error" text={errors.industry} />
                </fieldset>
              )}

              {step === 3 && (
                <fieldset>
                  <legend id="draft-title" className="font-syne font-extrabold uppercase text-[clamp(26px,5vw,34px)] leading-[1.05] tracking-[-0.01em] mb-2">{t.q3.title}</legend>
                  <p className="text-[15px] text-dim mb-6">{t.q3.hint}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {t.q3.options.map((o, i) => (
                      <Choice
                        key={o}
                        type="checkbox"
                        name="goals"
                        label={o}
                        checked={data.goals.includes(i)}
                        onChange={() => set('goals', data.goals.includes(i) ? data.goals.filter((g) => g !== i) : [...data.goals, i])}
                      />
                    ))}
                  </div>
                  <Label htmlFor="draft-note">{t.q3.note}</Label>
                  <textarea
                    id="draft-note"
                    rows={3}
                    value={data.note}
                    onChange={(e) => set('note', e.target.value)}
                    className={`${fieldClass(false)} h-auto py-3 resize-none`}
                  />
                </fieldset>
              )}

              {step === 4 && (
                <>
                  <h2 id="draft-title" className="font-syne font-extrabold uppercase text-[clamp(26px,5vw,34px)] leading-[1.05] tracking-[-0.01em] mb-7">{t.q4.title}</h2>
                  <div className="mb-5">
                    <Label htmlFor="draft-name">{t.q4.name}</Label>
                    <input
                      id="draft-name"
                      data-field="name"
                      type="text"
                      autoComplete="name"
                      value={data.name}
                      onChange={(e) => set('name', e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'draft-name-error' : undefined}
                      className={fieldClass(!!errors.name)}
                    />
                    <FieldError id="draft-name-error" text={errors.name} />
                  </div>
                  <div className="mb-5">
                    <Label htmlFor="draft-email">{t.q4.email}</Label>
                    <input
                      id="draft-email"
                      data-field="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => set('email', e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'draft-email-error' : undefined}
                      className={fieldClass(!!errors.email)}
                    />
                    <FieldError id="draft-email-error" text={errors.email} />
                  </div>
                  <div className="mb-6">
                    <Label htmlFor="draft-phone">{t.q4.phone}</Label>
                    <input
                      id="draft-phone"
                      type="tel"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      aria-describedby="draft-phone-hint"
                      className={fieldClass(false)}
                    />
                    <p id="draft-phone-hint" className="mt-2 text-[15px] text-dim">{t.q4.phoneHint}</p>
                  </div>
                  <p className="text-[14px] leading-[1.6] text-dim">
                    {t.q4.privacy}{' '}
                    <a href="/privacy" target="_blank" rel="noopener" className="text-muted underline underline-offset-4 hover:text-accent">
                      {t.q4.privacyLink}
                    </a>
                    .
                  </p>
                  {status === 'error' && (
                    <div role="alert" className="mt-6 p-4 border border-[#ff7a7a]/50 bg-[#ff7a7a]/10 text-[15px] leading-[1.6]">
                      {t.errors.send}{' '}
                      <a href={`mailto:${MAIL}`} className="text-accent underline underline-offset-4">{MAIL}</a>.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fuß */}
            <div className="flex items-center justify-between gap-3 border-t border-line px-6 md:px-8 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              {step === 1 ? (
                <button type="button" onClick={onCall} className="text-left text-[15px] text-muted hover:text-accent transition-colors py-2">
                  {t.call}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setErrors({}); setStep(step - 1); }}
                  className="font-mono text-[14px] uppercase text-muted hover:text-accent transition-colors h-12 px-1"
                >
                  {t.back}
                </button>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="shrink-0 inline-flex items-center font-mono text-[14px] font-medium uppercase whitespace-nowrap bg-accent text-ink px-6 h-12 border border-accent hover:bg-transparent hover:text-accent disabled:opacity-60 disabled:cursor-wait transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {step < TOTAL ? t.next : status === 'sending' ? t.sending : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default DraftDialog;
