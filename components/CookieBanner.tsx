import React, { useState, useEffect } from 'react';

const GA_ID = 'G-0EETZ8V1K4';
const FB_PIXEL_ID = '842051572153086';

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
  function gtag(...args: unknown[]) { window.dataLayer.push(args); }
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="container mx-auto max-w-4xl bg-panel border border-line p-6 font-body">
        <p className="text-muted text-sm mb-4 leading-relaxed">
          Wir verwenden Cookies und Tracking-Technologien (Google Analytics, Facebook Pixel), um unsere Website zu verbessern und Werbeanzeigen zu optimieren.
          Mehr dazu in unserer{' '}
          <button
            onClick={() => {
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-accent hover:text-ftext underline transition-colors"
          >
            Datenschutzerklärung
          </button>.
        </p>
        <div className="flex flex-wrap gap-3 font-mono text-[13px] uppercase">
          <button onClick={() => accept('all')} className="px-5 py-3 bg-accent text-ink font-medium border border-accent hover:bg-transparent hover:text-accent transition-colors">
            Alle akzeptieren
          </button>
          <button onClick={() => accept('necessary')} className="px-5 py-3 bg-transparent text-ftext font-medium border border-line hover:border-accent hover:text-accent transition-colors">
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
