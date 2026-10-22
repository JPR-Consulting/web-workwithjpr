export const post = {
  slug: 'praxis-telefon-terminbuchung-praxissoftware',
  title: 'Arztpraxis: Telefon, Online-Terminbuchung und Praxissoftware verbinden',
  description: 'Wie Telefon, KI-Telefonassistent, Online-Terminbuchung und Praxisverwaltungssystem zusammenspielen, welche Schnittstellen es gibt, was das kostet und was der Datenschutz verlangt. Mit Checkliste für die Auswahl.',
  date: '2026-10-22',
  updated: '2026-10-22',
  seoTitle: 'Arztpraxis: Telefon, Online-Terminbuchung & Praxissoftware verbinden',
  seoDescription: 'So verbindest du Telefon, KI-Telefonassistent, Online-Terminbuchung und Praxissoftware (PVS): Schnittstellen, Kosten, Datenschutz nach DSK-Beschluss und Checkliste.',
  tags: ['Praxis', 'Terminbuchung', 'Automatisierung'],
  readTime: '9 min',
  faq: [
    {
      q: 'Können Online-Termine automatisch in meine Praxissoftware übertragen werden?',
      a: 'Ja, wenn der Buchungsanbieter eine Schnittstelle zu deinem Praxisverwaltungssystem hat. Wie automatisch das läuft, ist sehr unterschiedlich: Manche Verbindungen tragen Termine selbstständig in beide Richtungen ein, bei anderen muss jemand die Übernahme anstoßen, für manche Systeme gibt es gar keine Verbindung. Frag den Anbieter konkret nach deinem System und danach, ob Termine oder nur Stammdaten übertragen werden.',
    },
    {
      q: 'Was kostet ein KI-Telefonassistent für die Praxis?',
      a: 'Stand Oktober 2026 liegen die Einstiegspreise bei etwa 39–49 € netto im Monat, oft plus Kosten pro bearbeitetem Anliegen. Pauschalen liegen je nach Gesprächsmenge bei etwa 99–299 € netto im Monat. Bei Doctolib ist der Assistent Teil eines Pakets. Achte auf Mindestlaufzeit und darauf, ob die Verbindung zu deiner Praxissoftware im Preis enthalten ist.',
    },
    {
      q: 'Ist ein KI-Telefonassistent datenschutzkonform?',
      a: 'Das hängt vom Anbieter und vom Vertrag ab. Wichtig sind ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO, eine Verpflichtung zur Schweigepflicht nach § 203 StGB, Server in Deutschland oder der EU und klare Löschfristen für Aufnahmen und Abschriften. Anrufer sollten außerdem erfahren, dass sie mit einer KI sprechen.',
    },
    {
      q: 'Müssen Patienten für die Online-Terminbuchung ein Konto anlegen?',
      a: 'Nicht unbedingt. Laut Datenschutzkonferenz kann ein Buchungsdienst im Auftrag der Praxis arbeiten, dann braucht es keine Einwilligung, nur eine Information der Patienten. Legt ein Patient dagegen ein Konto bei der Plattform an, ist die Plattform dafür selbst verantwortlich und braucht in der Regel seine Einwilligung.',
    },
  ],
  content: `
## Die kurze Antwort

Telefon, Online-Terminbuchung und Praxissoftware lassen sich verbinden, und zwar in einer Kette: **Telefonanlage mit Weiterleitung → KI-Telefonassistent oder Online-Buchung → Terminkalender des Buchungsanbieters → Verbindung zur Praxissoftware → Praxisverwaltungssystem (PVS).** Ob das gut funktioniert, entscheidet fast immer eine Frage: Hat der Anbieter eine Schnittstelle zu *deinem* PVS, und trägt sie Termine automatisch in beide Richtungen ein? Kläre das vor dem Vertrag, dazu Kosten, Laufzeit und Datenschutz.

## Warum das Thema drängt

- **Patienten erreichen Praxen schlecht am Telefon.** In einer Umfrage des GKV-Spitzenverbands waren 44 % der Versicherten unzufrieden mit der telefonischen Erreichbarkeit, 42 % sagen, sie sei in fünf Jahren schlechter geworden ([GKV-Spitzenverband, 2025](https://www.gkv-spitzenverband.de/gkv_spitzenverband/presse/pressemitteilungen_und_statements/pressemitteilung_1975066.jsp)).
- **Online-Termine werden erwartet.** In derselben Umfrage fanden 51 % Online-Terminbuchung wichtig, 2022 waren es 31 %.
- **Viele Praxen bieten sie noch nicht an.** Laut KBV-PraxisBarometer 2025 bieten 31 % der Praxen Online-Termine an ([KBV, 2025](https://www.kbv.de/praxis/tools-und-services/praxisnachrichten/2025/10-16/praxisbarometer-2025-niedergelassene-bleiben-vorreiter-in-sachen-digitalisierung)).

## So hängen die Bausteine zusammen

| Baustein | Aufgabe | Worauf achten |
| --- | --- | --- |
| Telefonanlage | Anrufe annehmen und weiterleiten | Weiterleitung nach Anliegen möglich? Genug Leitungen, am besten VoIP |
| KI-Telefonassistent | Anrufe entgegennehmen, Termine buchen, Anliegen aufnehmen | Bucht er direkt in den Kalender oder nur als Notiz fürs Team? |
| Online-Terminbuchung | Patienten buchen selbst, auf der Website oder in einer App | Lässt sie sich in deine Website einbinden? |
| Verbindung zum PVS | Termine und Patientendaten abgleichen | Dein System dabei? Automatisch oder per Klick? Eine oder beide Richtungen? |
| Praxisverwaltungssystem | Bleibt das führende System | Verlangt der PVS-Hersteller Gebühren für die Schnittstelle? |

## Wie Buchungstools mit der Praxissoftware reden

Die Verbindung heißt meist „Konnektor“ oder „Schnittstelle“. Sie wird oft auf einem Praxisrechner oder Server installiert und gleicht Daten zwischen Buchungsanbieter und PVS ab. Drei Stufen kommen vor:

1. **Vollautomatisch, in beide Richtungen:** Online gebuchte Termine stehen sofort im PVS, Termine aus dem PVS blockieren den Platz online.
2. **Halbautomatisch:** Die Daten kommen an, aber jemand im Team muss die Übernahme anstoßen.
3. **Keine Verbindung:** Termine werden doppelt gepflegt. Das ist fehleranfällig und frisst die Zeitersparnis wieder auf.

Zwei Beispiele, wie Anbieter das beschreiben:

- **Dr. Flex** liest nach eigenen Angaben über seinen [PVS-Connector](https://dr-flex.de/produkt/pvs-connector) freie Zeiten, Sprechzeiten und Terminarten aus dem PVS und schreibt Buchungen, Verschiebungen und Absagen zurück. Das PVS bleibt das führende System.
- **Doctolib** bietet [Konnektoren](https://community.doctolib.de/t/entdecken-sie-unsere-konnektoren-und-erleichtern-sie-ihre-arbeitsablaeufe/77154) unter anderem für Albis, medatixx, Dampsoft, Medistar, tomedo, Evident, x.isynet und M1 PRO an. Sie gleichen vor allem Patientenstammdaten ab. Die Installation ist bei Doctolib kostenlos, der PVS-Hersteller kann aber Gebühren verlangen.

Wichtig: Die Listen ändern sich, und „Schnittstelle vorhanden“ heißt noch nicht „läuft automatisch“. Frag immer nach deinem konkreten System und lass dir zeigen, wie ein Termin vom Telefon bis ins PVS kommt.

## Was ein KI-Telefonassistent kann und was nicht

Ein KI-Telefonassistent nimmt Anrufe an, versteht das Anliegen und bucht im besten Fall direkt einen Termin. Die Unterschiede zwischen den Anbietern sind groß. Stand 22.10.2026, Preise netto:

| Anbieter | Was er laut Anbieter kann | Preis |
| --- | --- | --- |
| [Doctolib Telefonassistent](https://media.doctolib.com/image/upload/mkg/file/fragen-antworten-webinar-mehr-ki-weniger-ko.pdf) | bucht freie Termine (einer pro Anruf), nur Deutsch; Absagen und Verschieben „in Kürze“; bei fremdem PVS wird die Zusammenfassung von Hand übernommen | Teil des Pakets „Patientenmanagement“, laut [GIGA](https://www.giga.de/tech/was-kostet-doctolib-diese-preise-und-tarife-gibt-es-aktuell--01KPN5Y6VMKWGMSGVS4BDCZ046) 229 € im Monat (Stand April 2026) |
| [Dr. Flex VoiceAI](https://dr-flex.de/produkt/ki-telefonassistent) | bucht, verschiebt und sagt Termine direkt im PVS ab; Rezept-, Überweisungs- und AU-Wünsche werden Aufgaben fürs Team; Server in Deutschland | ab 39 € im Monat plus 0,89 € pro Anliegen, oder 99 € pauschal für einen Kalender, monatlich kündbar ([Preise](https://dr-flex.de/aerzte/preis)) |
| [VITAS](https://www.telefonassistent.de/preise) | Server in Deutschland, ISO 27001 und C5; Anbindung an Praxissysteme im Pro-Paket über Partner oder Webhook | 49 € (Flex), 119 € (500 Gespräche), 299 € (1.500 Gespräche) im Monat |

Erfahrungen aus Praxen gehen auseinander. Das Deutsche Ärzteblatt beschreibt eine Praxis, die ihren Vertrag wieder gekündigt hat: Anrufer legten oft auf, und eine Schnittstelle zur Terminbuchung fehlte. Eine andere Praxis schätzt nach eigener Auswertung, mindestens 25 Stunden im Monat zu sparen ([Ärzteblatt](https://www.aerzteblatt.de/archiv/blickwinkel-wie-hilfreich-sind-telefonassistenten-6c16f31e-f965-4fdd-a814-30d7c6058376)). Der Unterschied liegt oft genau an der Verbindung zum Kalender.

Zwei Punkte zur Technik: Doctolib empfiehlt für den Assistenten mindestens vier Telefonleitungen, am besten VoIP. Und Anrufer sollten erfahren, dass sie mit einer KI sprechen. Das sieht auch die europäische KI-Verordnung vor.

## Was der Datenschutz verlangt

Praxen verarbeiten Gesundheitsdaten, die die DSGVO besonders schützt (Art. 9). Für Terminverwaltung hat die Datenschutzkonferenz (DSK) im Juni 2025 einen eigenen [Beschluss](https://datenschutzkonferenz-online.de/media/dskb/DSK-Beschluss_Positionspapier_Terminverwaltungsunternehmen.pdf) veröffentlicht. Die wichtigsten Punkte:

- Ein externer Buchungsdienst kann **im Auftrag der Praxis** arbeiten (Auftragsverarbeitung nach Art. 28 DSGVO). Dann braucht es keine Einwilligung, aber eine Information der Patienten, die den Dienst nennt.
- **Nur die nötigen Daten:** Name, Geburtsdatum, Behandler, Terminart, Kontakt. Kein Komplett-Upload aller Patientenstammdaten zum Anbieter.
- **Erinnerungen** per Mail oder SMS brauchen eine ausdrückliche Einwilligung.
- Der Anbieter darf die Daten **nicht für eigene Zwecke** nutzen.
- Kalendereinträge zeitnah nach dem Termin **löschen**.
- Die Praxis muss prüfen, wie sicher die Verbindung zwischen PVS und Anbieter ist und ob Support oder Wartung außerhalb der EU stattfindet.
- Es sollte immer auch einen **nicht-digitalen Weg** zum Termin geben.

Dazu kommt die Schweigepflicht: Externe Dienstleister dürfen nur so viel erfahren, wie für ihre Aufgabe nötig ist, und müssen zur Verschwiegenheit verpflichtet werden ([§ 203 StGB](https://www.gesetze-im-internet.de/stgb/__203.html)).

## Checkliste vor dem Vertrag

- Steht **mein PVS** auf der Liste des Anbieters? Werden **Termine** übertragen oder nur Stammdaten?
- Läuft der Abgleich **automatisch und in beide Richtungen**, oder muss jemand klicken?
- **Kosten:** Monatspreis, Kosten pro Anliegen, Einrichtung und Gebühren des PVS-Herstellers.
- **Laufzeit:** Mindestlaufzeit und Kündigungsfrist.
- **Verträge:** Auftragsverarbeitungsvertrag (Art. 28 DSGVO) und Verpflichtung nach § 203 StGB.
- **Serverstandort** und ob Support oder Wartung außerhalb der EU stattfinden.
- **Löschfristen** für Kalendereinträge, Gesprächsaufnahmen und Abschriften.
- **Patienteninformation:** Gibt der Anbieter einen Textbaustein für die Datenschutzerklärung mit?
- **Test:** Einen Termin vom Anruf bis ins PVS live vorführen lassen.

## Welche Rolle die Praxis-Website spielt

Die Website ist der Ort, an dem Patienten die meisten Fragen selbst klären, bevor sie anrufen: Sprechzeiten, Leistungen, Anfahrt, und vor allem der Knopf zur Online-Buchung. Ein gut eingebundenes Buchungstool auf der eigenen Website nimmt dem Telefon spürbar Arbeit ab. Wie ein Buchungssystem ausgewählt und eingebunden wird, steht in [Online-Terminbuchung für Praxen](/blog/online-terminbuchung-praxis). Wie eine Praxis-Website mit Terminbuchung aussehen kann, zeigen wir auf der Seite [Website für Praxen](/website-fuer-praxen).

> **Du willst sehen, wie deine Praxis-Website mit Online-Termin aussehen könnte?** Trag deine aktuelle Website ein. In 48 Stunden bekommst du einen kostenlosen, anklickbaren Entwurf. Ein vorhandenes Buchungssystem wie Doctolib binden wir ein.
>
> [Kostenlosen Entwurf anfordern](#entwurf)

## Quellen

- [DSK: Datenschutz bei der Terminverwaltung durch Heilberufspraxen (Beschluss vom 16.06.2025)](https://datenschutzkonferenz-online.de/media/dskb/DSK-Beschluss_Positionspapier_Terminverwaltungsunternehmen.pdf)
- [KBV: PraxisBarometer Digitalisierung 2025](https://www.kbv.de/praxis/tools-und-services/praxisnachrichten/2025/10-16/praxisbarometer-2025-niedergelassene-bleiben-vorreiter-in-sachen-digitalisierung)
- [GKV-Spitzenverband: Umfrage zur Erreichbarkeit von Praxen](https://www.gkv-spitzenverband.de/gkv_spitzenverband/presse/pressemitteilungen_und_statements/pressemitteilung_1975066.jsp)
- [§ 203 StGB: Verletzung von Privatgeheimnissen](https://www.gesetze-im-internet.de/stgb/__203.html)
- [Dr. Flex: PVS-Connector](https://dr-flex.de/produkt/pvs-connector), [KI-Telefonassistent](https://dr-flex.de/produkt/ki-telefonassistent) und [Preise](https://dr-flex.de/aerzte/preis)
- [Doctolib: Konnektoren](https://community.doctolib.de/t/entdecken-sie-unsere-konnektoren-und-erleichtern-sie-ihre-arbeitsablaeufe/77154) und [FAQ zum Telefonassistenten (Februar 2026)](https://media.doctolib.com/image/upload/mkg/file/fragen-antworten-webinar-mehr-ki-weniger-ko.pdf)
- [VITAS: Preise](https://www.telefonassistent.de/preise)
- [Deutsches Ärzteblatt: Wie hilfreich sind Telefonassistenten?](https://www.aerzteblatt.de/archiv/blickwinkel-wie-hilfreich-sind-telefonassistenten-6c16f31e-f965-4fdd-a814-30d7c6058376)
- [GIGA: Was kostet Doctolib?](https://www.giga.de/tech/was-kostet-doctolib-diese-preise-und-tarife-gibt-es-aktuell--01KPN5Y6VMKWGMSGVS4BDCZ046)
`,
};
