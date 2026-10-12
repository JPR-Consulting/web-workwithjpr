import type React from 'react';

/**
 * Props für einen echten <a href>-Link innerhalb der App: Crawler und Strg-/Mittel-Klick
 * sehen die Adresse, ein normaler Klick wechselt die Ansicht ohne Neuladen.
 */
export function spaLink(href: string, go: () => void) {
  return {
    href,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      go();
    },
  };
}
