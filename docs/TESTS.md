# Testprotokoll · 27.11.2026

## Automatisiert

`npm run build`, `npm run check` und `npm test` erfolgreich. **27 Tests bestanden**, keine ausgelassenen Tests in der automatisierten Suite.

Geprüft: Datenstruktur und eindeutige IDs, Vollständigkeit lokaler Bilddateien und relativer Pfade, Ziehung aller 125 Funde ohne Wiederholung bis zur Poolausschöpfung, Fachgrenzen, Neu-Mischen, CHAOS mit verschiedenen Kategorien, sichere URLs und Importprüfung, lokale Persistenz, beschädigter oder gesperrter Speicher, Standardwerte ohne Live-Abfragen und Klang, Import-/Export-Rundlauf, Met-Suchversion und Rechtefilter, Fehler- und Ratenbegrenzungsfälle, zwei mathematische Beispiele sowie Offline-Navigation und Cache-Isolation des Service Workers in einer simulierten Worker-Umgebung.

Die automatisierten Provider- und Offline-Tests verwenden kontrollierte Antworten. Sie ersetzen keinen echten Browser-Netzwerktest.

## Bereits im Browser beobachtet

- Desktop-Chromium: Instrumententafel, Fachwahl, Münzausgabe und Lesedialog funktionieren.
- Einzelnen Fund gespeichert, Seite neu geladen und Fund in der Wunderkammer wiedergefunden.
- CHAOS-Montage mit drei Funden und sichtbarer Kennzeichnung als imaginäre Verbindung angezeigt.
- Ruhiges Fach mit eigener SVG-Illustration und poetischem Fragment angezeigt.
- Reduzierte Bewegung als Einstellung nach Neuladen erhalten.
- Live-Met-Abfrage: echtes Objekt 547976 mit Metadaten und geladenem Bild; anschließend gespeichert.
- Fehlgeschlagener Live-Versuch führte zu einem lokalen Fund, der Automat blieb bedienbar.
- Finale schmale Ansichten bei **337 und 449 CSS-Pixeln** per Browserzoom: kein horizontaler Seitenüberlauf. Bei 337 Pixeln Fund per Enter geöffnet und Lesedialog ohne Überlauf. Dies sind CSS-Layouttests, keine iPhone-Emulation.
- Echter Browser-Dateiexport; Testsammlung anschließend geleert und per Dateiauswahl wieder importiert: beide Funde wieder vorhanden.

## Veröffentlichung und Live-Prüfung

**Erfolgreich veröffentlicht am 27.11.2026.**

- URL: **https://forens1c.github.io/serendipitron-test/**
- Repository: **https://github.com/forens1c/serendipitron-test** · öffentlich nach ausdrücklicher Freigabe.
- GitHub Pages: `main` / Projektstamm, HTTPS erzwungen.
- Erster Deployment-Lauf: [46009193491](https://github.com/forens1c/serendipitron-test/actions/runs/46009193491), Status **Success**, Build und Deploy erfolgreich, Gesamtdauer 38 Sekunden. Getesteter Anwendungsstand: `8c4fdcc4e58a25ef852c1ed5e2f6f0b8f3aea75f`.
- Zusätzlicher HTTPS-Abruf: Startseite **HTTP 200**, sämtliche **37 Laufzeitdateien HTTP 200** und bytegenau identisch mit dem getesteten lokalen Stand. TLS-Zertifikate wurden beim Abruf regulär geprüft.
- Nach Veröffentlichung im Chromium-Browser erneut geprüft: Münzausgabe, Einzelfund, CHAOS mit drei unterschiedlichen Fächern, Quellen-/Fiktionskennzeichnung, Speichern und Erhalten der Wunderkammer nach Neuladen sowie Suche.
- Echtes Live-Museumsfenster vom GitHub-Pages-Ursprung: Met-Objekt **502724**, „Ensuranai“, mit Katalogdaten und geladenem Bild (natürliche Bildbreite 401 Pixel).
- Öffentliche Seite bei **337 und 449 CSS-Pixeln** geprüft: kein horizontaler Überlauf; Fundkarte per Tastatur geöffnet, Dialog und eigene Illustration geladen.
- Der öffentliche Browser bestätigt eine **bereitstehende Offline-Kopie**. Das belegt die Aktivierung des Service Workers, ersetzt aber keinen Offline-Wiederbesuch auf einem echten Mobilgerät.
- Abschließende Dokumentationsänderungen verändern keine Laufzeitdateien.

## Nicht durchgeführt

- Test auf einem **echten iPhone oder in Safari/WebKit**.
- Erfolgreicher echter Offline-Wiederbesuch: Beim kontrollierten Abschalten des Vorschau-Ursprungs gelangte die Cloud-Browserumgebung in eine nicht automatisierbare Browserfehlerseite. Der Ende-zu-Ende-Offline-Nachweis ist deshalb **nicht erbracht**; die separaten Worker-Tests bestehen. Offline-Bereitschaft wird in den Einstellungen ausdrücklich angezeigt; auf der veröffentlichten HTTPS-Seite wurde eine bereitstehende Offline-Kopie bestätigt. Ein Wiederholungstest durch Umgehung der Browserrichtlinie wurde nicht vorgenommen.
- VoiceOver- oder vollständige Screenreader-Prüfung.
- Hörprüfung der optionalen synthetischen Klickgeräusche.
- Vollständige Wiedergabe aller neun externen Musikangebote; Anbieter können nur Hörproben, andere Zugangsbedingungen oder zeitweise Ausfälle haben.
- Langzeittest bei vollem iOS-Speicher oder automatischer Browser-Datenbereinigung.

## Quellenprüfung

Faktentexte wurden mit verlinkten Primär- bzw. institutionellen Quellen abgeglichen; philosophische Einordnungen stützen sich auf Fachreferenzen, Fiktion ist als solche markiert. 14 Museumseinträge und ihre Open-Access-Bilder wurden direkt abgerufen und lokal bereitgestellt. Ein zusätzlicher technischer HTTP-Stichlauf umfasste 77 Quellen-URLs: 52 HTTP-200-Antworten, daneben Zugriffsbeschränkungen, eine 202-Antwort und ein anschließend korrigierter veralteter ESA-Link. Eine 403-Antwort dieses Abrufwegs beweist keinen weltweit kaputten Link; entsprechende Inhalte waren über die Recherche zugänglich. Zwei ergänzende Belege wurden danach hinzugefügt. Kein automatischer HTTP-Test kann die Wahrheit jeder Formulierung beweisen.

## Bekannte Grenzen und nächste Schritte

Die Inhalte sind ein endlicher redaktioneller Katalog. Live-Daten sind ungeprüfte Museumskatalogdaten und benötigen eine Verbindung. Die Wunderkammer synchronisiert nicht zwischen Geräten; externe Live-Bilder sind nicht Bestandteil des Offline-Archivs oder des JSON-Exports. Bei vollständigem Speicher kann nur die laufende Sitzung erhalten bleiben.

Für v0.3: echte iPhone-/Safari-Tests und VoiceOver, weitere kuratierte Inhaltspakete, mehr unterschiedliche CHAOS-Verknüpfungen mit spezifischen redaktionellen Brücken sowie ein geprüftes, optionales NASA-Bildfenster. Eine KI-Kuration wäre ein eigenständiger späterer Entwicklungsschritt mit nachvollziehbarer Quellen- und Rechteprüfung.


## Erweiterungsprüfung v0.2 · 27.11.2026

`npm run build`, `npm run check` und `npm test` erfolgreich: **36 Tests**, darunter 9 zusätzliche Generator-, Kompatibilitäts- und Cache-Tests. Alle 24.576 Titel vollständig auf Eindeutigkeit und gültige Datenstruktur geprüft; Adjektivendungen für alle 32 Stämme und alle 24 Kopfsubstantive geprüft. Weitere Fälle: gewünschtes Beispiel, gelegentliche Beispiele, Wiederholungsvermeidung selbst bei konstantem Zufallsgeber, Wiederaufnahme gespeicherter Historie, standardmäßig deaktiviertes Modul nur in ABSURDISTAN, Übernahme des v0.1-Speichers, Export/Import mit alten und neuen Funden, CHAOS mit verschiedenen Kategorien und Abweisung manipulierter Generator-Metadaten. Die vorhandenen 27 Tests bestehen weiterhin.

Browser-Vorschau in Chromium: Zuschalten, Münze, Leseransicht mit Satirehinweis, Speicherung und Neuladen erfolgreich. Zwei bereits vorhandene Sammlungsstücke waren danach weiterhin vorhanden. CHAOS kombinierte generierte Begriffe mit zwei bzw. drei Funden aus verschiedenen Fächern. Einstellung für reduzierte Bewegung ließ sich einschalten. Bei 337 CSS-Pixeln kein horizontaler Überlauf: Dokument 337/337, Leser 297/297 Pixel. Das ist eine schmale Desktop-Browseransicht, kein echter iPhone-Test.

Die Inhaltsdatenbank wurde per SHA-256 vor/nach der Änderung auf unveränderten Inhalt geprüft. v0.1 bleibt in der Git-Historie bei `ed2db809e965e43ad1e4cc0cf83c336957d3ace3` erhalten. Keine anderen Repositorys geändert.

Für diese Erweiterung nicht durchgeführt: echte Safari-/iPhone-Prüfung, Hörprüfung, VoiceOver, erneuter Live-Museumsabruf und echter Offline-Wiederbesuch. Die vorhandenen isolierten Provider- und Worker-Tests bestehen; eine Offline-Ende-zu-Ende-Garantie wird daraus nicht abgeleitet. Der frühere Prototypbericht oben dokumentiert gesonderte v0.1-Prüfungen.
