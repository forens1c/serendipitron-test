# Architektur v0.1

Die App ist statisch und funktioniert unter einem GitHub-Pages-Unterpfad ohne Build-Schritt zur Laufzeit.

| Datei | Aufgabe |
| --- | --- |
| `index.html` | Zugängliche Instrumententafel, Ausgabefach und native Dialoge |
| `style.css` | Gehäuse, Messing, Glas, responsive Anordnung und reduzierte Bewegung |
| `js/app.js` | DOM, Bedienung, Dialoge, Wunderkammer, Audio und Fehlerbehandlung |
| `js/engine.js` | Fachauswahl, Wiederholungsvermeidung, CHAOS und Eingabevalidierung |
| `js/storage.js` | Versionierter lokaler Zustand, Ausfallverhalten und geprüfter Import |
| `js/providers.js` | Optionaler Met-Adapter mit Zeitlimit, begrenzten Anfragen und Rechteprüfung |
| `data/fundstuecke.json` | 125 lokale Funde, Schema-Version 1 |
| `data/image-credits.json` | Herkunft und Rechte der 14 mitgelieferten Museumsbilder |
| `data/offline-files.json` | Automatisch erstellte Liste der eigenen Offline-Dateien |
| `sw.js` | Projektgebundener Cache; keine externen APIs oder Bilder |

## Fundstück

```json
{
  "id": "sta-001",
  "category": "staunen",
  "kind": "fact",
  "title": "Regen für eine andere Welt",
  "teaser": "Auf Titan hat das Wetter eine andere Chemie.",
  "body": ["Eigenständig formulierter Text …"],
  "tags": ["Astronomie", "Kreislauf"],
  "sources": [{"label": "Primärquelle", "url": "https://…", "checked": "2026-11-27"}]
}
```

Optional: `image` mit `src`, `credit`, `alt`, `url`; `media` mit `label`, `url`, optional `type: "music"`; `format: "poem"`; `live: true` für ungeprüfte Katalogimporte.

Die persistente Sammlung speichert vollständige Fundpakete einschließlich Text, Quellen und CHAOS-Verbindung. Dadurch bleibt ein gespeicherter Text erhalten, wenn sich der Katalog später ändert. Bilder liegen als lokale oder freigegebene externe Referenz vor; externe Bilder werden nicht stillschweigend lokal archiviert. Exporte enthalten keine Bilddateien.

## Ziehung

Ein persistenter Satz gezogener IDs verhindert Wiederholungen, solange im gewählten Pool unbekannte Funde liegen. Wird ein Pool ausgeschöpft, wird nur dessen Historie freigegeben. Der unmittelbar vorherige Fund wird bei der Neumischung nach Möglichkeit nicht wieder ausgegeben. Die Historie enthält höchstens 2000 IDs. Kein Tracking und keine Auswertung persönlicher Vorlieben.

CHAOS zieht zuerst aus dem gewählten Fach und anschließend aus anderen Fächern. Die Verbindung nennt entweder ein gemeinsames redaktionelles Tag oder eine ausdrücklich imaginäre Montage. Es gibt keine behauptete verborgene Kausalität.

## Spätere KI-Kuration

Ein weiterer Adapter kann denselben Vertrag wie `createMuseumProvider().next(seen, rng, signal)` erfüllen und ein validiertes Fundstück liefern. Ein zukünftiger Rechercheprozess braucht Quellenabgleich, Rechteprüfung und redaktionelle Freigabe. Geheimnisse dürfen dabei nicht in den Browser gelangen; dafür wäre gegebenenfalls ein gesonderter vertrauenswürdiger Dienst erforderlich. Dieser Prozess ist in v0.1 nicht implementiert.

Neue Adapter müssen standardmäßig deaktiviert bleiben, ihre Datenübertragung erklären und bei Fehlern die lokale Auswahl verfügbar lassen. Der bestehende DOM-Renderer verwendet Textknoten statt fremdem HTML, erlaubt ausschließlich HTTPS-Quellen und begrenzt Bildherkünfte. Die Content Security Policy muss bei neuen Bild- oder API-Herkünften bewusst angepasst werden.

## Grenzen

localStorage hat browserabhängige Grenzen. Die Sammlung ist technisch auf 1500 Pakete begrenzt; beim früheren Erreichen der Speicherquote gibt es einen sichtbaren Hinweis und Export bleibt möglich. Die Grenze ist keine Nutzungsaufgabe. Importdateien dürfen höchstens 2 MB groß sein. Es gibt keine Geräte-Synchronisierung.
