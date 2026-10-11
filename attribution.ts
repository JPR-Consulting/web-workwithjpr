// Anzeigen-Zuordnung: Klick-IDs und UTM-Parameter beim Seitenaufruf merken und mit der
// Formular-Anfrage des Besuchers mitschicken. Bleibt im sessionStorage (first-party),
// wird nur zusammen mit der eigenen Anfrage übertragen.
const KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const STORE = 'jpr_attribution';

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    if (Object.keys(found).length) {
      const prev = JSON.parse(sessionStorage.getItem(STORE) ?? '{}') as Record<string, string>;
      sessionStorage.setItem(STORE, JSON.stringify({ ...prev, ...found }));
    }
  } catch {
    /* Zuordnung ist Nebensache */
  }
}

/** „Quelle: utm_source=… gclid=…“ oder leer, wenn nichts gespeichert ist. */
export function attributionLine(): string {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORE) ?? '{}') as Record<string, string>;
    const order = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
    const bits = order.filter((k) => stored[k]).map((k) => `${k}=${stored[k]}`);
    return bits.length ? `Quelle: ${bits.join(' ')}` : '';
  } catch {
    return '';
  }
}
