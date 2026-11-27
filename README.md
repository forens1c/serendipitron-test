# PB Labs · SERENDIPITRON v0.1

**Eine Maschine, die deine Aufmerksamkeit nicht besitzen möchte.**

Ein tatsächlich bedienbarer digitaler Kunst- und Gedankenwechselautomat. HTML, CSS und native JavaScript-Module; keine Laufzeitabhängigkeiten, Konten, geheimen Schlüssel oder eigener Server.

Man muss nicht aufhören zu denken. Man kann seinem Denken einen anderen Gegenstand anbieten.

## Bedienung

1. Ein Fach wählen: STAUNEN, VERSINKEN, ANDERSDENKEN, ABSURDISTAN, VERWEILEN oder ZUFALL.
2. Die kostenlose symbolische Münze einwerfen.
3. Das Fundstück im Ausgabefach öffnen – oder liegen lassen.
4. Bei Interesse in der persönlichen Wunderkammer ablegen.

CHAOS kombiniert zwei oder drei Funde verschiedener Fächer. Gemeinsame redaktionelle Motive und ausdrücklich imaginäre Montagen werden kenntlich gemacht. Die Texte entstehen aus festen Regeln; es gibt keine KI-Generierung und keine autonome Recherche.

Die Wunderkammer kann durchsucht, seitenweise betrachtet, als JSON exportiert und wieder importiert werden. Einstellungen, Ziehungshistorie und Sammlung bleiben in diesem Browser. Neue Funde werden bevorzugt; ein erschöpftes Fach mischt sich neu. Die Anwendung verlangt weder vollständiges Lesen noch irgendeinen Fortschritt.

## Inhalt

| Fach | Lokale Funde |
| --- | ---: |
| STAUNEN | 35 |
| VERSINKEN | 25 |
| ANDERSDENKEN | 25 |
| ABSURDISTAN | 20 |
| VERWEILEN | 20 |
| **Gesamt** | **125** |

ZUFALL greift auf alle 125 Funde zu. Dazu kommen optional neue Werke über die Met-Schnittstelle. Enthalten sind 14 lokal mitgelieferte CC0-Museumsbilder, neun Musikfunde auf offiziellen externen Anbieterseiten und eigene SVG-Illustrationen. Die Musik liegt nicht in der Anwendung; manche Anbieter bieten Hörproben statt ganzer Aufnahmen. Es wird nichts automatisch abgespielt.

Die JSON-Datenbank unterscheidet `fact`, `hypothesis`, `philosophy`, `association` und `fiction`. Eigene Bildbetrachtungen und mögliche Hörperspektiven stehen sichtbar als solche im Text. Quellen sind pro Fund verlinkt; das Prüfdatum ist der 27.11.2026. Live-Katalogmetadaten sind ausdrücklich nicht einzeln redaktionell geprüft.

## Lokal starten

```sh
python3 -m http.server 8000
```

Anschließend `http://localhost:8000` öffnen. Ein Doppelklick auf `index.html` reicht wegen der Module und JSON-Abfragen nicht aus. Für Offline-Speicherung ist HTTPS oder localhost erforderlich.

Für die folgenden Entwicklungsbefehle wird Node.js 20 oder neuer benötigt; `npm install` ist nicht erforderlich:

```sh
npm run build
npm run check
npm test
```

`build` aktualisiert Offline-Dateiliste und Cache-Fingerabdruck und erstellt eine identische statische Vorschau in `dist/`. GitHub Pages verwendet die Dateien direkt aus dem Projektstamm. `dist/`, `.openai/` und lokale Laufzeitdaten gehören nicht ins Repository.

## GitHub Pages

Publikationsziel ist ausschließlich `serendipitron-test`, Branch `main`, Ordner `/ (root)`. `.nojekyll` verhindert eine unnötige Jekyll-Verarbeitung. Sämtliche Anwendungspfade sind relativ. Andere Repositorys sind nicht Teil dieses Projekts.

Wenn ein öffentliches Repository erforderlich ist, darf es erst nach ausdrücklicher Freigabe des Auftraggebers öffentlich angelegt oder umgestellt werden. Die Pages-Veröffentlichung und ihre HTTPS-Prüfung sind erst nach einer erfolgreichen Bereitstellung abgeschlossen; siehe [Testprotokoll](docs/TESTS.md).

## Datenschutz und Offline-Verhalten

- Keine Werbung, Tracker, Analyse-Skripte, Konten, Profile, Push-Nachrichten oder Abonnements.
- Keine externen Schriften oder zur Laufzeit eingebundenen Bibliotheken.
- Standardmäßig ausschließlich Anfragen an die eigene Herkunft.
- Lokale Sammlung unter `pblabs.serendipitron.v1` in localStorage. Bei gesperrtem Speicher funktioniert die Sitzung weiter und zeigt einen Hinweis.
- Exporte verlassen den Browser nur durch eine eigene Entscheidung der nutzenden Person. Importe werden lokal geprüft und mit der Sammlung zusammengeführt, nicht hochgeladen.
- Das optionale Museumsfenster ist anfangs ausgeschaltet. Aktiviertes Abrufen und Anzeigen externer Bilder überträgt Verbindungsdaten an das Museum. Externe Quellen und Musiklinks öffnen sich ohne Referrer in einem neuen Tab.
- GitHub verarbeitet als Hosting-Anbieter technisch notwendige Verbindungsdaten nach seinen eigenen Bedingungen.
- Ein Service Worker speichert die mitgelieferten Anwendungsdateien. Nach erfolgreichem Erstbesuch ist der lokale Automat offline nutzbar. Ein Erstbesuch und externe Musik, Quellen oder Live-Bilder brauchen Internet. Browser können Offline-Daten aus Speichergründen entfernen.
- Der Service Worker behandelt ausschließlich diesen Projektpfad und bereinigt ausschließlich seine eigenen Caches. Andere Projekte auf demselben GitHub-Pages-Ursprung bleiben unberührt.

Mechanische Geräusche sind ausgeschaltet, bis sie ausdrücklich aktiviert werden. `prefers-reduced-motion` wird respektiert; zusätzlich gibt es einen Schalter für weniger Bewegung. Große Schaltflächen, native Dialoge, Tastaturbedienung und sichtbare Fokusmarkierungen sind enthalten.

## Erweiterung

- [Datenmodell und Architektur](docs/ARCHITECTURE.md)
- [Geprüfte Schnittstellen](docs/INTERFACES.md)
- [Tests und bekannte Grenzen](docs/TESTS.md)
- [Bildnachweise](data/image-credits.json)

Neue Funde erhalten stabile IDs, eine echte Kategorie, eine eindeutige Einordnung, kurze Texte, Tags und überprüfbare Quellen. Nach Ergänzungen die drei Entwicklungsbefehle ausführen. Fakten und Assoziationen dürfen nicht stillschweigend ineinander übergehen.

## Rechte

Originale Texte, Gestaltung, Illustrationen und Programmcode: PB Labs, 2026. Für diese Eigenanteile wird in v0.1 keine zusätzliche öffentliche Nutzungslizenz erteilt. Die Met-Bilder und zugehörigen offenen Werkdaten werden nach den CC0/Open-Access-Angaben des Museums verwendet. Die einzelnen Nachweise inklusive Original-Download und Credit Line stehen in `data/image-credits.json`. Musikaufnahmen werden ausschließlich verlinkt und nicht weiterverbreitet. Marken und externe Inhalte gehören ihren jeweiligen Rechteinhabern.

Unabhängiges kreatives Experiment. Keine Therapieanwendung, keine Selbstoptimierungsziele und keine gesundheitlichen Versprechen.
