// Entirely local language satire. No scientific claims or external requests.
import { random } from './engine.js?v=0.2.0';
export const NOTICE = 'Sprachsatire – ohne wissenschaftlichen Geltungsanspruch.';
export const INSTITUTE = 'PB Labs – Institut für angewandte Begriffseskalation';
export const ADJECTIVES = ['Transzendental','Dialektisch','Metakognitiv','Quasikausal','Bürokratisch','Ontologisch','Subquantisch','Hermeneutisch','Ätherisch','Hyperreflexiv','Paradox','Kontrafaktisch','Protokollarisch','Interdimensional','Epistemisch','Rekursiv','Amtlich','Spekulativ','Kontemplativ','Zirkulär','Neometaphysisch','Postlogisch','Präventiv','Resonant','Selbstreferenziell','Begrifflich','Irreversibl','Protokollkompatibl','Fraktal','Transadministrativ','Hypothetisch','Kosmologisch'];
export const ROOTS = [
 ['Relevanz','vermeintlicher Wichtigkeit'],['Referenzpunkt','gedanklicher Bezugspunkte'],['Bedeutungs','überschüssiger Bedeutung'],['Evidenz','unbelegter Gewissheiten'],['Zuständigkeits','ungeklärter Zuständigkeiten'],['Aufmerksamkeits','abgeschweifter Aufmerksamkeit'],['Deutungs','voreiliger Deutungen'],['Erkenntnis','vorläufiger Erkenntnisse'],['Entropie','ordnungsgemäßer Unordnung'],['Quanten','imaginärer Quanten'],['Resonanz','unbestätigter Resonanzen'],['Kausalitäts','unterstellter Ursachen'],['Verantwortungs','delegierter Verantwortung'],['Formular','unausgefüllter Formulare'],['Protokoll','überzähliger Protokolle'],['Akten','herrenloser Akten'],['Sinn','vorsorglich erzeugten Sinns'],['Selbstbeobachtungs','beobachteter Selbstbeobachtung'],['Widerspruchs','ordnungsgemäßer Widersprüche'],['Gewissheits','geliehener Gewissheit'],['Äther','administrativ erfassten Äthers'],['Meta','übergeordneter Überordnungen'],['Horizont','verschobener Horizonte'],['Gedanken','unbeaufsichtigter Gedanken'],['Überzeugungs','vorläufig endgültiger Überzeugungen'],['Schlussfolgerungs','verfrühter Schlussfolgerungen'],['Wirklichkeits','angenommener Wirklichkeit'],['Möglichkeits','ungenutzter Möglichkeiten'],['Absolutheits','relativer Absolutheit'],['Zwischenraum','unvermieteter Zwischenräume'],['Vakuum','ordnungsgemäß angemeldeter Leere'],['Begründungs','nachgereichter Begründungen']
];
// Every slot receives a genitive phrase; adjective endings follow the head noun.
export const OPERATIONS = [
 ['perforation','f','Das unkontrollierte Entweichen {g} aus einem zuvor überbewerteten Sachverhalt.'],
 ['verdichtung','f','Die Zusammenpressung {g} bis zur Unleserlichkeit bei unverändertem Seitenumfang.'],
 ['entkopplung','f','Die feierliche Trennung {g} von sämtlichen praktischen Konsequenzen.'],
 ['eskalation','f','Die stufenweise Steigerung {g}, bis ein Unterausschuss erforderlich erscheint.'],
 ['umverteilung','f','Die geregelte Verschiebung {g} in einen unzuständigen Bereich.'],
 ['vernebelung','f','Die Verhüllung {g} durch eine hinreichend aufwendige Erläuterung.'],
 ['oszillation','f','Die regelmäßige Schwankung {g} zwischen Beschluss und Korrekturvermerk.'],
 ['deklination','f','Die grammatische Beugung {g}, bis selbst der Dativ um Versetzung bittet.'],
 ['überlagerung','f','Die gleichzeitige Ablage {g} in mehreren unvereinbaren Wirklichkeiten.'],
 ['rekalibrierung','f','Die nachträgliche Justierung {g} auf das bereits verkündete Ergebnis.'],
 ['formalisierung','f','Die Überführung {g} in ein Formular ohne zutreffendes Kästchen.'],
 ['sedimentierung','f','Die langsame Ablagerung {g} am Boden eines ungeklärten Gesprächs.'],
 ['kollaps','m','Der schlagartige Zusammenbruch {g} beim Öffnen der Anlage zum Anhang.'],
 ['überhang','m','Der nicht genehmigte Überschuss {g} über den verfügbaren Erklärungsbedarf.'],
 ['resonator','m','Ein fiktives Instrument zur geräuschlosen Verstärkung {g} in leeren Sitzungssälen.'],
 ['kompensator','m','Ein erfundener Apparat zum Ausgleich {g} durch zusätzliches Stirnrunzeln.'],
 ['rückstau','m','Der Rückfluss {g} in die noch nicht eröffnete Vorbesprechung.'],
 ['beschleuniger','m','Ein imaginärer Apparat zur Beschleunigung {g} auf nahezu amtliche Geschwindigkeit.'],
 ['kontinuum','n','Ein gedachtes Kontinuum {g}, dessen Anfang vorsorglich auf morgen verschoben wird.'],
 ['vakuum','n','Die vollständige Abwesenheit {g} bei gleichzeitig hoher Sitzungsdichte.'],
 ['protokoll','n','Ein Verfahren zur lückenlosen Dokumentation {g} ohne Kenntnis des Gegenstands.'],
 ['paradoxon','n','Die gleichzeitige Bestätigung und Zurückweisung {g} durch dieselbe Fußnote.'],
 ['dispositiv','n','Ein erfundenes Gefüge zur vorsorglichen Verwaltung {g} vor dem ersten Auftreten.'],
 ['intervall','n','Die amtlich unbestimmte Pause zwischen dem Auftreten und der Bearbeitung {g}.']
];
export const COMBINATION_COUNT = ADJECTIVES.length * ROOTS.length * OPERATIONS.length;
const EXAMPLES = [
 'Ein Ausschuss erklärt sich einstimmig für unzuständig und beantragt dafür ein größeres Sitzungszimmer.',
 'Ein Gedankenexperiment erhält einen Parkausweis, weil es seit Jahren an derselben Stelle steht.',
 'Eine Büroklammer hält zwei widersprüchliche Weltbilder zusammen und beantragt Erschwerniszulage.',
 'Das Vakuum reicht eine Beschwerde wegen Überfüllung ein. Die Empfangsbestätigung bleibt leer.',
 'Ein Spiegel verweigert die Selbstreflexion, solange die Reisekostenfrage ungeklärt ist.',
 'Eine Fußnote wird zur Hauptsache befördert und verweist anschließend auf sich selbst.',
 'Ein imaginäres Pendel schwingt zwischen Ja und Nein; die Mitte wird als eigenständige Behörde gegründet.',
 'Der Äther erscheint persönlich zur Anmeldung seines Nichtvorhandenseins.'
];
export function termAt(index, withExample = false) {
  if (!Number.isInteger(index) || index < 0 || index >= COMBINATION_COUNT) throw new RangeError('Begriffsposition außerhalb der Walzen.');
  const operationIndex = index % OPERATIONS.length;
  const rootIndex = Math.floor(index / OPERATIONS.length) % ROOTS.length;
  const adjectiveIndex = Math.floor(index / (OPERATIONS.length * ROOTS.length));
  const [suffix, gender, definition] = OPERATIONS[operationIndex], [stem, genitive] = ROOTS[rootIndex];
  const adjective = ADJECTIVES[adjectiveIndex] + ({ f: 'e', m: 'er', n: 'es' })[gender];
  const title = `${adjective} ${stem}${suffix}`;
  const body = [definition.replace('{g}', genitive), `Im erfundenen Sprachgebrauch bezeichnet „${adjective}“ hier eine Eigenschaft, deren Nachweis bis zur nächsten Begriffskommission vertagt wurde.`];
  if (withExample) body.push(`Imaginäres Anwendungsbeispiel: ${EXAMPLES[index % EXAMPLES.length]}`);
  return { id: `synth-${index}`, category: 'absurdistan', kind: 'fiction', generator: 'terminology-v1', termParts: [adjective, stem, suffix], title, teaser: NOTICE, body, tags: ['Sprachsatire', 'Begriffseskalation', 'Fiktion'], sources: [] };
}
export function synthesize(seen, rng = random) {
  const recent = new Set([...seen].filter(id => /^synth-\d+$/.test(id)).slice(-32));
  let index = Math.min(COMBINATION_COUNT - 1, Math.max(0, Math.floor(rng() * COMBINATION_COUNT)));
  while (recent.has(`synth-${index}`)) index = (index + 1) % COMBINATION_COUNT;
  const piece = termAt(index, rng() < .3);
  seen.delete(piece.id); seen.add(piece.id);
  return piece;
}
export const synthEnabled = (category, settings) => category === 'absurdistan' && settings.synth === true;
