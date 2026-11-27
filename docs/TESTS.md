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

## Veröffentlichungsstand

Das Repository `forens1c/serendipitron-test` wurde privat angelegt. GitHub zeigt für Pages ausdrücklich „Upgrade or make this repository public to enable Pages“. Ohne kostenpflichtiges Upgrade ist daher die noch ausstehende Freigabe des Auftraggebers zur öffentlichen Sichtbarkeit erforderlich. Es wurde keine Sichtbarkeitsänderung vorgenommen.

## Vor Veröffentlichung noch offen

- GitHub-Pages-Build, Deployment-Status und echte HTTPS-Erreichbarkeit.
- Erneute Bedien- und Darstellungsprüfung der veröffentlichten URL.

## Nicht durchgeführt

- Test auf einem **echten iPhone oder in Safari/WebKit**.
- Erfolgreicher echter Offline-Wiederbesuch: Beim kontrollierten Abschalten des Vorschau-Ursprungs gelangte die Cloud-Browserumgebung in eine nicht automatisierbare Browserfehlerseite. Der Ende-zu-Ende-Offline-Nachweis ist deshalb **nicht erbracht**; die separaten Worker-Tests bestehen. Offline-Bereitschaft wird nun in den Einstellungen ausdrücklich angezeigt. Ein Wiederholungstest durch Umgehung der Browserrichtlinie wurde nicht vorgenommen.
- VoiceOver- oder vollständige Screenreader-Prüfung.
- Hörprüfung der optionalen synthetischen Klickgeräusche.
- Vollständige Wiedergabe aller neun externen Musikangebote; Anbieter können nur Hörproben, andere Zugangsbedingungen oder zeitweise Ausfälle haben.
- Langzeittest bei vollem iOS-Speicher oder automatischer Browser-Datenbereinigung.

## Quellenprüfung

Faktentexte wurden mit verlinkten Primär- bzw. institutionellen Quellen abgeglichen; philosophische Einordnungen stützen sich auf Fachreferenzen, Fiktion ist als solche markiert. 14 Museumseinträge und ihre Open-Access-Bilder wurden direkt abgerufen und lokal bereitgestellt. Ein zusätzlicher technischer HTTP-Stichlauf umfasste 77 Quellen-URLs: 52 HTTP-200-Antworten, daneben Zugriffsbeschränkungen, eine 202-Antwort und ein anschließend korrigierter veralteter ESA-Link. Eine 403-Antwort dieses Abrufwegs beweist keinen weltweit kaputten Link; entsprechende Inhalte waren über die Recherche zugänglich. Zwei ergänzende Belege wurden danach hinzugefügt. Kein automatischer HTTP-Test kann die Wahrheit jeder Formulierung beweisen.

## Bekannte Grenzen und v0.2

Die Inhalte sind ein endlicher redaktioneller Katalog. Live-Daten sind ungeprüfte Museumskatalogdaten und benötigen eine Verbindung. Die Wunderkammer synchronisiert nicht zwischen Geräten; externe Live-Bilder sind nicht Bestandteil des Offline-Archivs oder des JSON-Exports. Bei vollständigem Speicher kann nur die laufende Sitzung erhalten bleiben.

Für v0.2: echte iPhone-/Safari-Tests und VoiceOver, weitere kuratierte Inhaltspakete, mehr unterschiedliche CHAOS-Verknüpfungen mit spezifischen redaktionellen Brücken sowie ein geprüftes, optionales NASA-Bildfenster. Eine KI-Kuration wäre ein eigenständiger späterer Entwicklungsschritt mit nachvollziehbarer Quellen- und Rechteprüfung.
