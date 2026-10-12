import type React from 'react';

/**
 * Zu einer internen Adresse wechseln, ohne Neuladen: Adresse setzen und popstate auslösen —
 * die App liest daraus die passende Ansicht (wie beim Zurück-Knopf des Browsers).
 */
export function goTo(href: string) {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

/**
 * Props für einen echten <a href>-Link innerhalb der App: Crawler und Strg-/Mittel-Klick
 * sehen die Adresse, ein normaler Klick wechselt die Ansicht ohne Neuladen.
 */
export function spaLink(href: string, go: () => void = () => goTo(href)) {
  return {
    href,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      go();
    },
  };
}
