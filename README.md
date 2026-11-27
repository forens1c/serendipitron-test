# PB Labs · SERENDIPITRON v0.2

## Neu in v0.2: Fachterminologischer Synthesator

**PB Labs – Institut für angewandte Begriffseskalation** ist ein satirisches Zusatzmodul. Wähle **ABSURDISTAN → BEGRIFFSWERK ZUSCHALTEN → MÜNZE EINWERFEN**. Drei mechanische Begriffswalzen liefern einen Titel mit Definition und gelegentlich einem imaginären Anwendungsbeispiel. Der Schalter ist zunächst ausgeschaltet, erscheint nur in ABSURDISTAN und merkt sich seine Stellung lokal. Andere Fächer bleiben unverändert; ausschalten bringt die gewöhnlichen ABSURDISTAN-Funde zurück. Auch mit CHAOS kombinierbar.

32 Adjektivstämme × 32 Themenstämme × 24 Operationen ergeben **24.576 eindeutige Titel**. Starke Adjektivendungen folgen dem grammatischen Geschlecht des letzten Substantivs. Definitionen verwenden kontrollierte Genitivbausteine. Philosophie, Metakognition, Physik, Bürokratie und erfundene Metaphysik liefern das Sprachmaterial. Die letzten 32 generierten Titel werden vermieden, auch nach Neuladen. Die Kombinationen entstehen vollständig lokal nach festen Regeln: keine KI, keine API, keine neuen Abhängigkeiten.

**Alle Ausgaben sind Sprachsatire ohne wissenschaftlichen Geltungsanspruch.** Das gilt für Begriffe, Definitionen und Anwendungsbeispiele. Die Speicherung als `fiction` hält diese Einordnung auch bei Export und Rückkehr zur älteren Anwendung sichtbar. Die Wunderkammer kann Begriffe wie andere Fundstücke ablegen, durchsuchen, exportieren und importieren. Klang- und Bewegungseinstellungen gelten auch für das Begriffswerk; die systemweite reduzierte Bewegung wird berücksichtigt.

### Bestand und Wiederherstellung

Die 125 kuratierten Fundstücke, 14 Bilder und bisherigen Funktionen bleiben erhalten. Der bestehende localStorage-Schlüssel `pblabs.serendipitron.v1` und das Exportformat Version 1 bleiben bestehen. Vorhandene Einstellungen und Sammlungen werden übernommen; nur der zusätzliche Schalter `synth` kommt hinzu. Sammlungen liegen weiterhin ausschließlich im jeweiligen Browser. Ein Export ist die geräteunabhängige Sicherung.

Die vollständige v0.1 ist im Commit [ed2db809](https://github.com/forens1c/serendipitron-test/commit/ed2db809e965e43ad1e4cc0cf83c336957d3ace3) erhalten. Für eine Rückkehr kann dessen Stand ausgecheckt oder als Wiederherstellungs-Commit auf main eingespielt werden, ohne die Historie zu überschreiben. Generierte Funde sind auch für den alten Datenvalidator gewöhnliche Fiktionsfunde. Versionierte Modulpfade und ein neuer, projektspezifischer Offline-Cache verhindern beim Upgrade eine Mischung alter und neuer Programmdateien. Das Modul benötigt nach vollständigem erstmaligem Laden keine Verbindung.


**Eine Maschine, die deine Aufmerksamkeit nicht besitzen möchte.**

[Automaten öffnen](https://forens1c.github.io/serendipitron-test/) · [Quellcode](https://github.com/forens1c/serendipitron-test)

Ein tatsächlich bedienbarer digitaler Kunst- und Gedankenwechselautomat. HTML, CSS und native JavaScript-Module; keine Laufzeitabhängigkeiten, Konten, geheimen Schlüssel oder eigener Server.

Man muss nicht aufhören zu denken. Man kann seinem Denken einen anderen Gegenstand anbieten.

## Über PB Labs

**PB Labs** steht für **Playbook Labs**: **PB** meint *Playbook*, **Labs** ein Labor für Forschung, Experimente und Entwicklung.

PB Labs ist eine unabhängige Ideen- und Entwicklerschmiede für kreative und technische Projekte. Neugier, spielerisches Entdecken und Freude am Experiment haben Vorrang.

Das Motto lautet: **„Question. Test. Evolve.“** – *Fragen. Prüfen. Weiterentwickeln.*

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

Veröffentlicht unter **https://forens1c.github.io/serendipitron-test/** aus `serendipitron-test`, Branch `main`, Ordner `/ (root)`. `.nojekyll` verhindert eine unnötige Jekyll-Verarbeitung. Sämtliche Anwendungspfade sind relativ. Andere Repositorys sind nicht Teil dieses Projekts.

Das Repository ist öffentlich. GitHub Pages erzwingt HTTPS. Build und Bereitstellung sowie die tatsächliche HTTPS-Erreichbarkeit wurden am 27.11.2026 erfolgreich geprüft; siehe [Testprotokoll](docs/TESTS.md).

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
