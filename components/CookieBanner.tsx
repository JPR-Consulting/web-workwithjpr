import React, { useState, useEffect } from 'react';
import { useCopy } from '../i18n';

const GA_ID = 'G-YC81Z6SB25';
const FB_PIXEL_ID = '842051572153086';
// Google Ads Conversion-Tracking (Konto JPR Consulting GmbH), Ziel „Entwurf-Anfrage (Website)“
const ADS_ID = 'AW-18450517572';

declare global {
  interface Window {
    dataLayer: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

function loadGoogleAnalytics() {
  if (document.getElementById('ga-script')) return;
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag.js verarbeitet nur echte arguments-Objekte. Ein Array (...args) wird
  // stillschweigend ignoriert — dann laedt das Skript, sendet aber nie Daten.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-rest-params
  function gtag(..._args: unknown[]) { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  gtag('config', ADS_ID);
}

function loadFacebookPixel() {
  if (window.fbq) return;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const fbq = function (...args: unknown[]) {
    if ((fbq as any).callMethod) {
      (fbq as any).callMethod(...args);
    } else {
      (fbq as any).queue.push(args);
    }
  } as any;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  /* eslint-enable @typescript-eslint/no-explicit-any */

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq!('init', FB_PIXEL_ID);
  window.fbq!('track', 'PageView');
}

function loadTrackingScripts() {
  loadGoogleAnalytics();
  loadFacebookPixel();
}

const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);
  const t = useCopy().cookie;

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'all') {
      loadTrackingScripts();
    } else if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = (type: 'all' | 'necessary') => {
    localStorage.setItem('cookieConsent', type);
    setShow(false);
    if (type === 'all') {
      loadTrackingScripts();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-auto md:w-[460px] z-50 p-2 md:p-4 animate-slide-up">
      <div className="bg-panel border border-line p-4 md:p-6 font-body">
        <p className="text-muted text-[13px] md:text-sm mb-3 md:mb-4 leading-snug md:leading-relaxed">
          {t.text}{' '}
          <button
            onClick={() => {
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-accent hover:text-ftext underline transition-colors"
          >
            {t.privacy}
          </button>.
        </p>
        <div className="flex gap-2 md:gap-3 font-mono text-[12px] md:text-[13px] uppercase">
          <button onClick={() => accept('all')} className="flex-1 md:flex-none px-3 md:px-5 py-3 bg-accent text-ink font-medium border border-accent hover:bg-transparent hover:text-accent transition-colors">
            {t.accept}
          </button>
          <button onClick={() => accept('necessary')} className="flex-1 md:flex-none px-3 md:px-5 py-3 bg-transparent text-ftext font-medium border border-line hover:border-accent hover:text-accent transition-colors">
            {t.necessary}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
