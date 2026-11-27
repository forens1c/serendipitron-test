# Öffentliche Schnittstellen · geprüft am 27.11.2026

Dokumentation und tatsächliche Erreichbarkeit sind unterschiedliche Prüfungen. Ein positives Ergebnis im Entwicklungsumfeld garantiert keine dauerhafte Verfügbarkeit. Alle externen Dienste sind für die lokale Datenbank entbehrlich.

| Dienst | Zugang / CORS | Rechte und Beschränkungen | Ergebnis und Integration |
| --- | --- | --- | --- |
| The Metropolitan Museum of Art | Ohne Schlüssel. Such- und Objektabfragen mit `Origin` ergaben HTTP 200 und `Access-Control-Allow-Origin: *`. Echter Browserabruf erfolgreich. | Nur Objekte mit `isPublicDomain === true` und vorhandenem Open-Access-Bild; CC0. Dokumentierte Obergrenze 80 Anfragen/s; App deutlich darunter, maximal eine Suche und drei Objektversuche pro bewusster Ziehung, mit Zeitlimit und kurzer Sperre gegen Mehrfachklicks. | **Optional integriert und im Browser erfolgreich geprüft**, einschließlich Bild. Bei Ausfall lokaler Fund. |
| Art Institute of Chicago | Ohne Schlüssel; offizielle Dokumentation sieht Browserintegration vor. Hier ergaben direkte API-Anfragen HTTP 403; keine erfolgreiche Browser-CORS-Prüfung. | Metadaten überwiegend CC0; längere Beschreibungen können CC BY 4.0 sein. Bilder nur bei `is_public_domain`; Dokumentation: anonym 60 Anfragen/min. | Untersucht, **nicht integriert**. |
| Wikimedia Commons | Action API unterstützt anonyme CORS-Abfragen mit `origin=*`. Hier HTTP 403, daher kein positiver Laufzeittest. | Rechte gelten je Datei. Autor, Lizenz, Quelle und ggf. Share-Alike müssen aus den Dateimetadaten übernommen werden. Keine pauschale freie Bildlizenz. | Untersucht, **nicht integriert**. |
| Wikipedia | Action API unterstützt `origin=*`; hier HTTP 403, daher kein positiver Laufzeittest. | Artikeltexte unter CC BY-SA; Attribution und Share-Alike beachten. Für belastbare Sachtexte wäre zusätzlicher Abgleich mit Primärquellen sinnvoll. | Untersucht, **nicht integriert**. |
| NASA Images API | Offizielle Dokumentation nennt CORS. `images-api.nasa.gov/search` ergab hier HTTP 200 und `Access-Control-Allow-Origin: *`, ohne Schlüssel. Kein Browser-Ende-zu-Ende-Test. | NASA-Inhalte sind in den USA grundsätzlich häufig nicht urheberrechtlich geschützt; gekennzeichnete Fremdinhalte und Personen-/Markenrechte bleiben gesondert. Keine pauschale Freigabe aller NASA-Assets. Keine feste Rate aus der konsultierten API-Dokumentation zugesichert. | Geeigneter Kandidat für v0.2, **nicht integriert**. |
| NASA APOD / api.nasa.gov | Viele Angebote verwenden einen Schlüssel. Der öffentliche DEMO_KEY ist stark begrenzt. | Rechte unterscheiden sich je Bild, häufig Fremdfotografie. | Für v0.1 nicht gewählt; kein Laufzeittest. |

## Met-Pfade

- Suche: `https://collectionapi.metmuseum.org/public/collection/v1.1/search`
- Objektdaten: `https://collectionapi.metmuseum.org/public/collection/v1/objects/{id}`
- Bilddateien: vom bestätigten Objekt gelieferte URLs unter `https://images.metmuseum.org/`

Der alte Suchpfad `/v1/search` wurde laut Museum zum 01.10.2026 abgekündigt. Die App nutzt den neuen paginierten Suchpfad. Suchbegriffe stammen aus einer kleinen kuratierten Liste; es wird kein persönliches Profil erstellt. Eine Suchantwort wird zeitweise im Arbeitsspeicher wiederverwendet. Die App sendet keine Cookies an den Dienst.

Ein erfolgreicher Browsertest lieferte das Objekt **547976**, „Drawing“, mit einem Bild unter `images.metmuseum.org`, das mit 599 Pixeln natürlicher Breite geladen wurde. Dieser konkrete Test belegt Datenabruf und Bilddarstellung; es ist keine Behauptung über die Verfügbarkeit sämtlicher Museumseinträge.

## Primärdokumentation

- [Met Collection API und aktuelle Suchversion](https://metmuseum.github.io/)
- [The Met Open Access](https://www.metmuseum.org/hubs/open-access)
- [Art Institute of Chicago API](https://api.artic.edu/docs/)
- [MediaWiki: Cross-site requests](https://www.mediawiki.org/wiki/API:Cross-site_requests)
- [NASA Images API, offizielle PDF-Dokumentation](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
- [NASA-Bedingungen für Bilder und Medien](https://www.nasa.gov/nasa-brand-center/images-and-media/)

Kein Dienst wird als autonome Recherche oder als KI-Kuration dargestellt. Musik wird auf offiziellen Künstler-, Museums- oder Labelseiten geöffnet; sie ist keine Live-API und wird daher nicht als solche gezählt.
