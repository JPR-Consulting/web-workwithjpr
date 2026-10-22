import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { attributionLine } from '../attribution';
import { trackEvent } from '../tracking';

/**
 * „Kostenlos prüfen lassen“: Website-Adresse, Name, E-Mail – Jan schaut sich die Seite von Hand an
 * und antwortet persönlich. Geht an dieselbe Kontakt-Automatik wie der Entwurf-Dialog; `kind`
 * sagt dem Workflow, dass die Bestätigungsmail vom Website-Check sprechen soll, nicht vom Entwurf.
 * Zählt bewusst NICHT als Google-Ads-Conversion (die gehört der Entwurf-Anfrage).
 */
const WEBHOOK_URL = 'https://n8n.workwithjpr.com/webhook/web-workwithjpr';
const MAIL = 'info@workwithjpr.com';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Anlass, landet in `source` und in der Nachricht, z. B. „php2shell“. */
  topic: string;
}

type Errors = Partial<Record<'website' | 'name' | 'email', string>>;

const EMPTY = { website: '', name: '', email: '', note: '', website2: '' };

const fieldClass = (invalid: boolean) =>
  `w-full h-14 px-4 bg-panel border ${invalid ? 'border-[#ff7a7a]' : 'border-line'} text-ftext text-[17px] font-body placeholder:text-dim transition-colors focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`;

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block font-mono text-[13px] uppercase text-muted mb-2">
    {children}
  </label>
);

const FieldError: React.FC<{ id: string; text?: string }> = ({ id, text }) =>
  text ? <p id={id} className="mt-2 text-[15px] text-[#ff9a9a]">{text}</p> : null;

const CheckDialog: React.FC<Props> = ({ open, onClose, topic }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'form' | 'sending' | 'done' | 'error'>('form');

  const set = <K extends keyof typeof EMPTY>(key: K, value: string) => {
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
      setErrors({});
      if (!dlg.open) dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
      trackEvent('form_open', { form: 'website_check', source: topic }, 'WebsiteCheckGeoeffnet');
    } else if (dlg.open) {
      dlg.close();
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    if (status === 'form' || status === 'error') trackEvent('form_close', { form: 'website_check' }, 'WebsiteCheckAbgebrochen');
    onClose();
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!/\S+\.\S{2,}/.test(data.website.trim())) e.website = 'Bitte die Adresse deiner Website eintragen, z. B. meinbetrieb.de.';
    if (data.name.trim().length < 2) e.name = 'Wie dürfen wir dich ansprechen?';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = 'Bitte eine gültige E-Mail-Adresse eintragen.';
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (data.website2) return; // Bot-Falle
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`check-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    const message = [
      `Anfrage: kostenloser Website-Check (Anlass: ${topic})`,
      data.note.trim() ? `Notiz: ${data.note.trim()}` : '',
      attributionLine(),
    ].filter(Boolean).join('\n');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'website-check',
          name: data.name.trim(),
          email: data.email.trim(),
          phone: '',
          company: '',
          website: data.website.trim(),
          message,
          timestamp: new Date().toISOString(),
          source: `workwithjpr.com · Website-Check · ${topic}`,
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        setStatus('done');
        trackEvent('generate_lead', { form: 'website_check', page: window.location.pathname }, 'WebsiteCheckAnfrage');
        return;
      }
    } catch {
      /* unten */
    }
    setStatus('error');
  };

  const firstName = data.name.trim().split(/\s+/)[0] ?? '';

  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent
      aria-labelledby="check-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      className="draft-dialog m-0 md:m-auto p-0 w-full h-[100dvh] max-w-none max-h-none md:w-[600px] md:h-fit md:max-h-[calc(100dvh-48px)] bg-ink text-ftext font-body md:border md:border-line"
    >
      <div className="flex flex-col h-full md:max-h-[calc(100dvh-48px)]">
        <div className="flex items-center justify-between gap-4 pl-6 md:pl-8 pr-3 pt-3">
          <div className="font-mono text-[13px] uppercase text-accent">Kostenloser Website-Check</div>
          <button
            type="button"
            onClick={close}
            aria-label="Schließen"
            className="grid place-items-center w-11 h-11 text-muted hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'done' ? (
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-10">
            <div className="grid place-items-center w-14 h-14 bg-accent text-ink mb-7" aria-hidden="true">
              <Check className="w-7 h-7" strokeWidth={3} />
            </div>
            <h2 id="check-title" className="font-syne font-extrabold uppercase text-[clamp(28px,5vw,38px)] leading-[1.05] tracking-[-0.01em] mb-4">
              Danke{firstName ? `, ${firstName}` : ''}!
            </h2>
            <p className="text-[18px] leading-[1.6] text-ftext/85 mb-9 max-w-[460px]">
              Wir schauen uns deine Website an und melden uns innerhalb eines Werktags an {data.email.trim()}.
            </p>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center font-mono text-[14px] font-medium uppercase bg-accent text-ink px-7 h-12 border border-accent hover:bg-transparent hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Schließen
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-8">
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
              <h2 id="check-title" className="font-syne font-extrabold uppercase text-[clamp(26px,5vw,34px)] leading-[1.05] tracking-[-0.01em] mb-3">
                Wir schauen drauf
              </h2>
              <p className="text-[17px] leading-[1.6] text-muted mb-7">
                Wir prüfen von außen PHP-Version, Hoster, Ladezeit und Handy-Ansicht und sagen dir ehrlich, ob du etwas tun musst. Keine Zugangsdaten nötig.
              </p>
              <div className="mb-6">
                <Label htmlFor="check-website">Deine Website</Label>
                <input
                  id="check-website"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="meinbetrieb.de"
                  value={data.website}
                  onChange={(e) => set('website', e.target.value)}
                  aria-invalid={!!errors.website}
                  aria-describedby={errors.website ? 'check-website-error' : undefined}
                  className={fieldClass(!!errors.website)}
                />
                <FieldError id="check-website-error" text={errors.website} />
              </div>
              <div className="mb-6">
                <Label htmlFor="check-name">Dein Name</Label>
                <input
                  id="check-name"
                  type="text"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'check-name-error' : undefined}
                  className={fieldClass(!!errors.name)}
                />
                <FieldError id="check-name-error" text={errors.name} />
              </div>
              <div className="mb-6">
                <Label htmlFor="check-email">Deine E-Mail</Label>
                <input
                  id="check-email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'check-email-error' : undefined}
                  className={fieldClass(!!errors.email)}
                />
                <FieldError id="check-email-error" text={errors.email} />
              </div>
              <div>
                <Label htmlFor="check-note">Noch etwas? (optional)</Label>
                <textarea
                  id="check-note"
                  rows={3}
                  placeholder="z. B. „Die Seite wurde 2018 gebaut, ich habe keinen Zugang mehr.“"
                  value={data.note}
                  onChange={(e) => set('note', e.target.value)}
                  className="w-full px-4 py-3 bg-panel border border-line text-ftext text-[17px] font-body placeholder:text-dim transition-colors focus:border-accent focus:outline-none"
                />
              </div>
              {status === 'error' && (
                <p role="alert" className="mt-6 text-[16px] text-[#ff9a9a]">
                  Das hat leider nicht geklappt. Schreib uns einfach an <a href={`mailto:${MAIL}`} className="underline">{MAIL}</a>.
                </p>
              )}
            </div>
            <div className="px-6 md:px-8 py-5 border-t border-line">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto inline-flex items-center justify-center font-mono text-[14px] font-medium uppercase bg-accent text-ink px-7 h-12 border border-accent hover:bg-transparent hover:text-accent transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {status === 'sending' ? 'Wird gesendet …' : 'Kostenlos prüfen lassen →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default CheckDialog;
