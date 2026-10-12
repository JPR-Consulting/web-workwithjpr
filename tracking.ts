// Messpunkte für Google Analytics und Facebook-Pixel. Beide laden erst nach Cookie-Zustimmung
// (CookieBanner); ohne Zustimmung tun diese Funktionen nichts.

const ADS_LEAD = 'AW-18450517572/MplhCNStyJkdEMSc8t1E';

function gtag(...args: unknown[]) {
  // gtag.js verarbeitet nur echte arguments-Objekte (siehe CookieBanner).
  // eslint-disable-next-line prefer-rest-params
  (function push(..._a: unknown[]) { window.dataLayer.push(arguments); })(...args);
}

/** Ereignis an GA4 (Name `ga`) und als eigenes Ereignis an den Facebook-Pixel (Name `fb`). */
export function trackEvent(ga: string, params: Record<string, string | number>, fb?: string) {
  try {
    const p = { page: window.location.pathname, ...params };
    if (document.getElementById('ga-script') && window.dataLayer) gtag('event', ga, p);
    if (fb) window.fbq?.('trackCustom', fb, p);
  } catch {
    /* Messung ist Nebensache */
  }
}

/** Abgeschickte Entwurf-Anfrage: GA4-Lead, Google-Ads-Conversion, Pixel-Lead. Nur hier zählt Google Ads. */
export function trackLead() {
  try {
    if (document.getElementById('ga-script') && window.dataLayer) {
      gtag('event', 'generate_lead', { form: 'entwurf', page: window.location.pathname });
      gtag('event', 'conversion', { send_to: ADS_LEAD });
    }
    window.fbq?.('track', 'Lead');
  } catch {
    /* Messung ist Nebensache */
  }
}
