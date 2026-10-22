export const post = {
  slug: 'php-8-2-support-ende',
  title: 'PHP 8.2 Support-Ende am 31.12.2026: Was du jetzt tun solltest',
  description: 'Ab 2027 bekommt PHP 8.2 keine Sicherheitsupdates mehr. Fast jede vierte WordPress-Seite läuft noch darauf. Was das bedeutet, was Hoster dafür extra verlangen und wie du sicher auf PHP 8.3 oder 8.4 umstellst.',
  date: '2026-10-22',
  updated: '2026-10-22',
  seoTitle: 'PHP 8.2 Support-Ende 31.12.2026: Was Website-Betreiber tun sollten',
  seoDescription: 'PHP 8.2 bekommt ab 2027 keine Sicherheitsupdates mehr. Support-Daten aller Versionen, Aufpreise der Hoster und eine Anleitung für den Umstieg auf PHP 8.3 oder 8.4.',
  tags: ['PHP', 'WordPress', 'Sicherheit'],
  readTime: '7 min',
  faq: [
    {
      q: 'Wann endet der Support für PHP 8.2?',
      a: 'Am 31. Dezember 2026. Danach veröffentlicht das PHP-Projekt für 8.2 keine Sicherheitsupdates mehr. Die letzte Version mit allen Sicherheitskorrekturen bis Oktober 2026 ist 8.2.35.',
    },
    {
      q: 'Funktioniert meine Website nach dem 31.12.2026 noch?',
      a: 'Ja. Die Website läuft weiter wie bisher. Neue Sicherheitslücken in PHP 8.2 werden ab dann aber nicht mehr geschlossen. Viele Hoster verlangen für veraltete Versionen außerdem einen monatlichen Aufpreis.',
    },
    {
      q: 'Auf welche PHP-Version sollte ich umstellen?',
      a: 'Auf PHP 8.3 oder 8.4. WordPress empfiehlt PHP 8.3 oder neuer. PHP 8.3 bekommt Sicherheitsupdates bis Ende 2027, PHP 8.4 bis Ende 2028. Laufen Theme und Plugins mit 8.4, ist das die längerfristige Wahl.',
    },
    {
      q: 'Stellt mein Hoster die PHP-Version automatisch um?',
      a: 'Meist nicht. IONOS schreibt ausdrücklich, dass es die PHP-Version nicht automatisch ändert (Ausnahme: Managed WordPress). Bei IONOS, STRATO und mittwald läuft eine veraltete Version stattdessen kostenpflichtig im „Extended Support“ weiter. Prüf am besten selbst, welche Version eingestellt ist.',
    },
  ],
  content: `
## Die kurze Antwort

**PHP 8.2 bekommt ab dem 1. Januar 2027 keine Sicherheitsupdates mehr.** Die Website läuft danach weiter, aber neue Lücken in PHP 8.2 werden nicht mehr geschlossen, und viele Hoster verlangen für veraltete Versionen einen monatlichen Aufpreis. Stell deine Website deshalb bis Ende 2026 auf **PHP 8.3 oder 8.4** um. Bei den meisten Seiten ist das eine Einstellung im Kundenmenü. Vorher Backup, Updates und ein kurzer Test.

## Wie lange bekommt welche PHP-Version Updates?

| PHP-Version | Sicherheitsupdates bis | Status im Oktober 2026 |
| --- | --- | --- |
| 8.1 und älter | – | keine Updates mehr (8.1 seit 31.12.2025) |
| 8.2 | 31.12.2026 | nur noch Sicherheitsupdates, endet bald |
| 8.3 | 31.12.2027 | Sicherheitsupdates |
| 8.4 | 31.12.2028 | voll unterstützt |
| 8.5 | 31.12.2029 | voll unterstützt |

Quelle: [php.net, unterstützte Versionen](https://www.php.net/supported-versions.php). PHP 8.6 soll laut Plan am 19. November 2026 erscheinen. Für den Umstieg musst du darauf nicht warten.

## Warum das Support-Ende wichtig ist

Im Oktober 2026 hat die Lücke [PHP2Shell](/blog/php2shell-php-sicherheitsluecke) gezeigt, was ein Support-Ende praktisch bedeutet: Das PHP-Projekt hat die kritischen Fehler für 8.2 bis 8.5 mit offiziellen Updates geschlossen. **PHP 8.1 und älter bekamen kein offizielles Update mehr**, nur Korrekturen im Quellcode, die Hoster selbst einbauen müssen. Ab 2027 steht PHP 8.2 in derselben Reihe.

## Wie viele Websites betrifft das?

Viele. Nach der Statistik von WordPress.org liefen im Oktober 2026 **23,7 % aller WordPress-Seiten auf PHP 8.2**. Weitere rund 36 % liefen schon auf Versionen, die gar keine Updates mehr bekommen (8.1 und älter). Ab Januar wären damit rund sechs von zehn WordPress-Seiten auf einer Version ohne Sicherheitsupdates, wenn niemand umstellt. Quelle: [WordPress.org, Statistik der PHP-Versionen](https://wordpress.org/about/stats/), abgerufen am 22.10.2026, eigene Summe.

## Was kostet es, nichts zu tun?

Viele Hoster lassen alte Versionen weiterlaufen, aber gegen Aufpreis. Stand 22.10.2026:

| Hoster | Aufpreis für veraltete PHP-Versionen |
| --- | --- |
| [IONOS](https://www.ionos.de/hosting/php-extended-support) | pro Monat z. B. 7,81 € für PHP 8.1, 15,62 € für 7.4 und 8.0, ab 18,28 € für noch ältere Versionen. 8.2 steht noch nicht auf der Liste. |
| [STRATO](https://www.strato.de/faq/hosting/was-ist-der-strato-php-extended-support/) | „Extended Support“ gegen eine „geringe monatliche Aufwandentschädigung“, für 8.1 seit 02.03.2026, für neuere Versionen kurz nach dem Support-Ende. Ein Preis steht nicht dabei. |
| [mittwald](https://www.mittwald.de/services/php-extended-support) | 5 € bzw. 15 € netto pro PHP-Version und Projekt im Monat, wird automatisch aktiviert |

IONOS schreibt ausdrücklich, dass es die PHP-Version nicht automatisch umstellt. Der Aufpreis läuft also weiter, bis du selbst wechselst. Ob dein Hoster ab 2027 auch für 8.2 einen Aufpreis verlangt, steht meist in einer Mail kurz vorher oder auf seiner Hilfeseite.

## Auf welche Version umstellen?

- **PHP 8.3:** von WordPress empfohlen („PHP 8.3 oder neuer“), Sicherheitsupdates bis Ende 2027. Die sichere Wahl, wenn ein Plugin mit 8.4 noch Probleme macht.
- **PHP 8.4:** Sicherheitsupdates bis Ende 2028. Die bessere Wahl, wenn Theme und Plugins mitspielen, weil du dir den nächsten Wechsel ein Jahr länger sparst.

## So stellst du um

Die Schritte folgen der [offiziellen WordPress-Anleitung](https://wordpress.org/support/update-php/):

1. **PHP-Version herausfinden:** In WordPress unter Werkzeuge → Website-Zustand → Bericht → Server. Wie das aussieht, zeigt die Bild-Anleitung im [PHP2Shell-Artikel](/blog/php2shell-php-sicherheitsluecke).
2. **Backup machen:** Dateien und Datenbank. Viele Hoster bieten das im Kundenmenü mit einem Klick an.
3. **WordPress, Theme und Plugins aktualisieren.** Neue Versionen sind meist schon für neues PHP vorbereitet.
4. **Am besten zuerst testen:** Viele Hoster bieten eine Test-Kopie der Website (Staging). Dort die neue PHP-Version einstellen und die wichtigsten Seiten und das Kontaktformular durchklicken.
5. **Umstellen:** Im Kundenmenü des Hosters die neue PHP-Version wählen. Danach Startseite, Unterseiten, Formulare und, falls vorhanden, den Shop prüfen.
6. **Wenn etwas hakt:** Zurück auf die alte Version stellen und das Problem-Plugin finden. Oft hilft ein Update, manchmal nur ein anderes Plugin.

Ein Hinweis zu einem oft empfohlenen Werkzeug: Das Plugin „PHP Compatibility Checker“ wird laut seiner WordPress-Seite **nicht mehr gepflegt** und prüft nur bis PHP 8.0. Für den Wechsel auf 8.3 oder 8.4 hilft es nicht weiter.

## Wenn die Umstellung nicht klappt

Fällt nach dem Umstieg etwas aus, liegt das fast immer an einem alten Theme oder einem Plugin, das seit Jahren keine Updates bekommt. Dann gibt es zwei Wege: das Problem gezielt beheben oder überlegen, ob sich eine Modernisierung lohnt. Woran du das erkennst, steht in [5 Zeichen, dass deine Website veraltet ist](/blog/5-zeichen-veraltete-website). Häufig reicht aber die Reparatur, und dann ist das auch die richtige Lösung.

> **Unsicher, auf welcher Version deine Website läuft?** Schick uns deine Website-Adresse. Wir schauen kostenlos nach, was wir von außen feststellen können, und sagen dir, was du als Nächstes tun solltest.
>
> [Website kostenlos prüfen lassen](#pruefen)

## Quellen

- [php.net: Unterstützte PHP-Versionen](https://www.php.net/supported-versions.php)
- [php.net: Sicherheitsupdates vom 21. Oktober 2026](https://www.php.net/)
- [WordPress.org: Systemvoraussetzungen](https://wordpress.org/about/requirements/)
- [WordPress.org: Statistik der PHP-Versionen](https://wordpress.org/about/stats/)
- [WordPress.org: Anleitung zum PHP-Update](https://wordpress.org/support/update-php/)
- [WordPress.org: Plugin „PHP Compatibility Checker“](https://wordpress.org/plugins/php-compatibility-checker/)
- [IONOS: PHP Extended Support](https://www.ionos.de/hosting/php-extended-support)
- [STRATO: PHP Extended Support](https://www.strato.de/faq/hosting/was-ist-der-strato-php-extended-support/)
- [mittwald: PHP Extended Support](https://www.mittwald.de/services/php-extended-support)
`,
};
