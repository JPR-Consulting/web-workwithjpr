export const post = {
  slug: 'php2shell-php-sicherheitsluecke',
  title: 'PHP2Shell: Ist deine Website von der PHP-Sicherheitslücke betroffen?',
  description: 'Zwei kritische Lücken in PHP haben im Oktober 2026 Behördenseiten vom Netz genommen und werden inzwischen aktiv ausgenutzt. Hier erfährst du, welche PHP-Versionen betroffen sind, was das für WordPress bedeutet und ob du selbst handeln musst oder dein Hoster das Update übernimmt.',
  date: '2026-10-22',
  updated: '2026-10-22',
  image: '/blog/php2shell/og.png',
  seoTitle: 'PHP2Shell: Ist meine Website betroffen? Versionen & was tun',
  seoDescription: 'PHP2Shell (CVE-2026-109618/-109619): betroffene und gepatchte PHP-Versionen, was mit WordPress ist und wie du in 2 Minuten prüfst, ob du handeln musst.',
  tags: ['Sicherheit', 'WordPress', 'PHP'],
  readTime: '8 min',
  faq: [
    {
      q: 'Wird PHP2Shell bereits aktiv ausgenutzt?',
      a: 'Ja. Amazon hat einen ersten Ausnutzungsversuch schon am 17. Oktober 2026 registriert, vier Tage vor der Bekanntgabe. Am Tag der Veröffentlichung tauchten mehrere Exploits auf, und Amazon beobachtete Angriffe von mehreren Akteuren. Laut Amazon wird PHP2Shell inzwischen breit ausgenutzt; ob einzelne Versuche erfolgreich waren, ist noch unklar. Auch Cloudflare hat Angriffe auf Kundenseiten beobachtet und Schutzregeln für alle Tarife mit Web-Firewall ausgerollt.',
    },
    {
      q: 'Muss ich als Besucher von Websites etwas tun?',
      a: 'Nein. Die Lücke steckt auf den Servern, nicht auf deinem Computer oder Handy. Indirekt kannst du betroffen sein, wenn Online-Dienste ausfallen oder Daten von ungeschützten Seiten abfließen.',
    },
    {
      q: 'Ist meine Website bei IONOS oder STRATO betroffen?',
      a: 'Bei normalem Webhosting ist der Hoster für das PHP-Update zuständig. IONOS hat gemeldet, das Update auf allen Systemen einzuspielen. Von STRATO war bis zum 22. Oktober 2026 keine öffentliche Aussage zu finden – frag dort schriftlich nach, welche PHP-Version deine Seite nutzt und ob das Update eingespielt ist. Auf einem eigenen Server bei diesen Anbietern musst du selbst aktualisieren.',
    },
    {
      q: 'Reicht ein Sicherheits-Plugin wie Wordfence?',
      a: 'Nein. Die Lücke liegt in PHP, also unterhalb von WordPress. Ein Angriff kann ansetzen, bevor WordPress und seine Plugins überhaupt starten. Ein Plugin ersetzt das PHP-Update deshalb nicht.',
    },
    {
      q: 'Meine Website läuft noch auf PHP 7.4. Was jetzt?',
      a: 'Für PHP 7.4 gibt es kein offizielles Update mehr, nur Korrekturen im Quellcode, die Hoster selbst einbauen können. Frag deinen Hoster, ob er das getan hat. Langfristig solltest du auf PHP 8.3 oder 8.4 umstellen. Bei älteren Seiten vorher prüfen, ob Theme und Plugins das mitmachen.',
    },
    {
      q: 'War meine Website deshalb am 21. Oktober offline?',
      a: 'Gut möglich. Viele Hoster und Betreiber haben Seiten vorsorglich abgeschaltet oder für das Update kurz neu gestartet. Läuft deine Seite jetzt wieder normal, war das in aller Regel diese Wartung.',
    },
    {
      q: 'Kann man von außen sehen, ob eine Website betroffen ist?',
      a: 'Nur eingeschränkt. Manche Server verraten ihre PHP-Version, viele nicht. Und eine alte Versionsnummer kann trotzdem vom Hoster nachträglich abgesichert sein. Sicher weiß es nur, wer Zugang zum Server oder zum Hosting hat. Online-Checker, die „sicher“ anzeigen, solltest du deshalb mit Vorsicht lesen.',
    },
  ],
  content: `
## Die kurze Antwort

PHP2Shell ist der Name für zwei kritische Sicherheitslücken in PHP, der Programmiersprache hinter WordPress, Joomla, TYPO3 und vielen Online-Shops (CVE-2026-109618 und CVE-2026-109619). Geschlossen sind sie in **PHP 8.5.12, 8.4.27, 8.3.36 und 8.2.35**, erschienen am 21. Oktober 2026. **PHP 8.1 und älter bekommt kein offizielles Update mehr.**

Die Lücke wird bereits aktiv angegriffen. Liegt deine Website bei einem normalen Webhosting-Anbieter, spielt in der Regel der Hoster das Update ein. Prüfe trotzdem kurz, welche PHP-Version deine Seite nutzt und ob das Update angekommen ist. Selbst handeln musst du vor allem, wenn du einen eigenen Server betreibst oder deine Seite noch auf PHP 8.1 oder älter läuft.

Wir aktualisieren diesen Artikel, wenn neue Informationen zur Lücke bekannt werden.

## Schnelltest: Musst du etwas tun?

![Entscheidungsbaum: Baukasten wie Wix oder Jimdo – nichts tun. Eigener Server oder VPS – handeln, PHP selbst aktualisieren. Webhosting-Paket oder Agentur mit PHP 8.2 bis 8.5 – kurz prüfen, ob der Patch installiert ist. Mit PHP 8.1 oder älter – handeln, auf PHP 8.3 oder 8.4 umstellen.](/blog/php2shell/schnelltest.png "560x945")

| Deine Situation | Was du tun solltest |
| --- | --- |
| Webhosting-Paket (z. B. IONOS, STRATO, Hostinger, ALL-INKL) mit PHP 8.2 bis 8.5 | Kurz prüfen. Normalerweise spielt der Hoster das Sicherheitsupdate ein. Sieh auf seiner Statusseite nach oder frag, ob der PHP2Shell-Patch installiert ist. |
| PHP 8.1 oder älter | Handeln: auf PHP 8.3 oder 8.4 umstellen, vorher Theme und Plugins prüfen. |
| Eigener Server, VPS oder Root-Server | Handeln: PHP selbst aktualisieren und alle PHP-Prozesse neu starten. |
| Eine Agentur oder ein Dienstleister betreut die Seite | Nachfragen, ob das Update eingespielt ist (Vorlage unten). |
| Baukasten wie Wix, Jimdo oder Squarespace | Nichts. Um die Technik kümmert sich der Anbieter. |

## Was ist passiert?

Am 20. Oktober 2026 kündigte das PHP-Team ein Notfall-Update für zwei kritische Lücken an. Am 21. Oktober um 16 Uhr deutscher Zeit erschien es. Viele Betreiber nahmen ihre Seiten vorsorglich vom Netz, darunter berlin.de, Universitäten, Krankenhäuser und Landesportale. Das BSI hat eine offizielle Warnung herausgegeben.

Die Lücken stecken in PHP selbst, genauer darin, wie PHP hochgeladene Formulardaten und Speicherfehler verarbeitet. Im schlimmsten Fall können Angreifer darüber ohne Passwort eigenen Code auf dem Server ausführen und so die Website übernehmen.

## Wie gefährlich ist PHP2Shell?

Beide Lücken haben die Bewertung 9,2 von 10 (CVSS 4.0), gelten also als kritisch. Ein Angreifer braucht kein Passwort und muss niemanden zu einem Klick bringen.

**Die Lücke wird bereits aktiv angegriffen.** Amazon registrierte einen ersten Ausnutzungsversuch schon am 17. Oktober, vier Tage vor der öffentlichen Bekanntgabe. Am Tag der Veröffentlichung tauchten mehrere Exploits auf, und Amazon beobachtete Angriffe von mehreren Akteuren. Laut Amazon wird PHP2Shell inzwischen breit ausgenutzt, ob einzelne Versuche erfolgreich waren, ist noch unklar ([AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)). Auch Cloudflare hat Angriffe auf Kundenseiten beobachtet und Schutzregeln ausgerollt, auch für kostenlose Tarife ([Cloudflare](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)).

Zur Einordnung: Ein Angriff ist technisch anspruchsvoll und braucht viele tausend Anfragen. Am größten ist das Risiko bei Servern mit Apache und mod_php. Dort hat das PHP-Team die Ausnutzung mit Standardeinstellungen bestätigt. Kein Grund zur Panik also, aber auch keiner, es liegen zu lassen.

## Welche PHP-Versionen sind betroffen, welche sicher?

Betroffen sind alle PHP-Versionen vor den Nummern in der Tabelle.

| PHP-Version | Abgesichert ab | Offizielles Update? |
| --- | --- | --- |
| 8.5 | 8.5.12 | ja |
| 8.4 | 8.4.27 | ja |
| 8.3 | 8.3.36 | ja |
| 8.2 | 8.2.35 | ja, aber Support endet am 31.12.2026 |
| 8.1, 8.0, 7.4 | – | nein, nur Quellcode-Korrekturen für Hoster und Admins |
| 7.3 und älter | – | nein |

Wichtig: Manche Hoster sichern ältere Versionen selbst ab. Eine alte Versionsnummer heißt also nicht automatisch, dass deine Seite ungeschützt ist. Frag im Zweifel nach. Läuft deine Seite auf PHP 8.2, plane den Umstieg schon jetzt: Was das [Support-Ende von PHP 8.2](/blog/php-8-2-support-ende) bedeutet, steht in einem eigenen Ratgeber.

## Ist WordPress von PHP2Shell betroffen?

**WordPress selbst hat diese Lücke nicht. Aber jede WordPress-Seite läuft auf PHP, und damit zählt die PHP-Version auf deinem Server.** WordPress-Websites können also betroffen sein, wenn die PHP-Version auf dem Server noch verwundbar ist. Ein Update von WordPress oder von Plugins allein schließt die Lücke nicht. Die Entdecker der Lücke haben Angriffe auf WordPress, Drupal, Joomla und Magento erfolgreich nachgestellt. Dasselbe gilt für TYPO3, Shopware und andere Systeme auf PHP-Basis.

Nicht verwechseln: Im Juli 2026 gab es mit „wp2shell“ eine ganz andere Lücke, und zwar im WordPress-Kern selbst. Sie ist seit WordPress 6.9.5 und 7.0.2 behoben.

## So prüfst du deine PHP-Version

**In WordPress (am einfachsten):** Im Admin-Bereich auf Werkzeuge → Website-Zustand → Bericht gehen und den Abschnitt „Server“ aufklappen. Dort steht die PHP-Version, zum Beispiel 8.3.36.

![So findest du die PHP-Version in WordPress: 1. Im Menü Werkzeuge, dann Website-Zustand. 2. Den Reiter Bericht öffnen. 3. Den Abschnitt Server aufklappen, dort steht die Zeile PHP-Version, zum Beispiel 8.3.36.](/blog/php2shell/php-version-wordpress.png "560x1019")

**Im Kundenmenü deines Hosters:** Bei den meisten Anbietern unter Webhosting oder Domains bei den PHP-Einstellungen.

**Beim Hoster nachfragen:** Wenn du keinen Zugang hast, frag den Support schriftlich. Eine Vorlage steht weiter unten.

Viele Hoster zeigen im Kundenmenü nur die Hauptversion, also „PHP 8.3“ statt „8.3.36“. Ob das Update eingespielt ist, kann dir dann nur der Hoster selbst sagen.

> **Unsicher, ob deine Website betroffen ist?** Schick uns einfach deine Website-Adresse. Wir schauen kostenlos nach, was wir von außen feststellen können, und sagen dir innerhalb eines Werktags, was du als Nächstes prüfen solltest. Braucht es dafür Angaben von deinem Hoster, sagen wir dir das.
>
> [Website kostenlos prüfen lassen](#pruefen)

## Was du jetzt tun solltest

1. **PHP-Version herausfinden**, wie oben beschrieben.
2. **Webhosting mit PHP 8.2 bis 8.5:** Prüfen, ob dein Hoster das Update gemeldet hat (Statusseite oder Support). Ist das bestätigt, ist in der Regel nichts weiter nötig.
3. **PHP 8.1 oder älter:** Auf PHP 8.3 oder 8.4 umstellen. Das geht meist mit einem Klick im Kundenmenü, aber nicht blind. Erst ein Backup machen, dann WordPress, Theme und Plugins aktualisieren, dann umstellen und die wichtigsten Seiten und das Kontaktformular testen. Themes und Plugins, die seit Jahren kein Update hatten, können mit neuem PHP ausfallen.
4. **Eigener Server:** PHP über den Paketmanager aktualisieren und alle PHP-Prozesse (PHP-FPM, Apache) neu starten. Notlösungen wie das Abschalten von session.upload_progress senken das Risiko nur. Sie schließen die Lücke nicht.
5. **Nach dem Update:** Das Update schließt die Lücke, entfernt aber nichts, was ein Angreifer vorher hinterlassen hat. Achte auf unbekannte Admin-Konten, neue Dateien und Weiterleitungen auf fremde Seiten. Kommt dir etwas komisch vor, hol dir Hilfe von jemandem, der auf gehackte Websites spezialisiert ist.

## Was, wenn ich keinen Zugang zu Hosting oder Server habe?

Dann frag die Person oder Firma, die deine Website gebaut hat oder betreut, oder direkt deinen Hoster. Diese Nachricht kannst du kopieren:

> Hallo, wegen der PHP-Sicherheitslücke PHP2Shell (CVE-2026-109618 und CVE-2026-109619): Welche PHP-Version nutzt meine Website [Adresse], und ist das Sicherheitsupdate vom 21.10.2026 dort bereits eingespielt? Falls die Seite noch auf PHP 8.1 oder älter läuft: Was empfehlen Sie, und was kostet die Umstellung? Vielen Dank!

## Was machen die großen Hoster?

Stand 22. Oktober 2026 haben IONOS, Hostinger, netcup, Hetzner und mittwald Updates oder Schutzmaßnahmen gemeldet. Von STRATO und ALL-INKL war bis dahin keine öffentliche Aussage zu finden. Wer bei einem dieser Anbieter einen eigenen VPS oder Root-Server mietet, muss selbst aktualisieren. Der Stand ändert sich schnell, die Statusseite deines Hosters ist die beste Quelle.

## Wenn deine Website ohnehin in die Jahre gekommen ist

Eine Seite auf PHP 8.1 oder älter ist oft ein Zeichen für mehr: ein altes Theme, viele Plugins, länger keine Wartung. Häufig reicht trotzdem ein PHP-Update, und dann ist das auch die richtige Lösung. Manchmal zeigt die Umstellung aber, dass Theme und Plugins nicht mehr mitkommen und die Reparatur mehr kostet, als sie bringt.

Dann lohnt ein Blick aufs Ganze. Woran du das erkennst, steht in [5 Zeichen, dass deine Website veraltet ist](/blog/5-zeichen-veraltete-website). Ob WordPress für dich weiter das Richtige ist, vergleicht [Individuelles Backend oder WordPress?](/blog/individuelles-backend-vs-wordpress). Und was eine neue Seite kostet, steht in unserem [Ratgeber zu Webdesign-Preisen](/blog/was-kostet-eine-website-berlin).

Zur Ehrlichkeit gehört auch: Moderne Websites, die ohne PHP und Plugins auskommen, brauchen weniger Updates. Automatisch sicher ist aber keine Technik. Jede Website braucht jemanden, der sich kümmert.

> **Wir schauen uns deine Website kostenlos an.** Von außen sehen wir uns PHP-Version, Hoster, Ladezeit und Handy-Ansicht an. Wenn ein PHP-Update reicht, sagen wir dir das. Wenn sich mehr lohnt, auch.
>
> [Website kostenlos prüfen lassen](#pruefen)

## Quellen

- [PHP: Sicherheitshinweis und Releases vom 21. Oktober 2026](https://www.php.net/)
- [GitHub Security Advisory zu CVE-2026-109618](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)
- [GitHub Security Advisory zu CVE-2026-109619](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)
- [BSI: Kritische Schwachstellen in PHP bedrohen Webanwendungen weltweit](https://www.bsi.bund.de/SharedDocs/Cybersicherheitswarnungen/DE/2026/2026-297981-1032.html)
- [AWS Security Blog: Ausnutzung von PHP2Shell vor der Bekanntgabe (englisch)](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)
- [Cloudflare: Schutzregeln gegen die PHP-Lücken (englisch)](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)
- [Tenable: Häufige Fragen zu PHP2Shell (englisch)](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)
- [Wordfence: wp2shell im WordPress-Kern, Juli 2026 (englisch)](https://www.wordfence.com/blog/2026/07/wp2shell-aftermath-the-first-critical-unauthenticated-wordpress-core-rce-in-nearly-a-decade/)
`,
};
