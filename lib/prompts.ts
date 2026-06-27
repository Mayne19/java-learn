import { Chapter } from './chapters'

const CONTEXT_BLOCK = (chapter: Chapter) => `Kapitel: ${chapter.de}
Schlüsselkonzepte: ${chapter.concepts.join(', ')}
Zusammenfassung: ${chapter.summary}

Häufige Prüfungsfallen:
- lokale Variable vs. Attribut (Instanzvariable)
- Objekt vs. Instanz vs. Klasse vs. Referenz
- Methode vs. Konstruktor vs. Funktion
- extends (Vererbung) vs. implements (Interface)
- Überschreiben (@Override) vs. Überladen (Overloading)
- statisch (static) vs. nicht-statisch

Antworte AUSSCHLIESSLICH mit gültigem JSON. Kein Markdown, keine Backticks.`

export function buildPrompt(chapter: Chapter, exerciseType: string, fillBlankMode?: string): string {
  const ctx = CONTEXT_BLOCK(chapter)

  switch (exerciseType) {
    case 'mcq':
      return `${ctx}

Erstelle eine Multiple-Choice-Frage über "${chapter.de}" auf Deutsch.
Die Frage kann Java-Code enthalten (optional). Wähle ZUFÄLLIG eine dieser Varianten:
- 1 richtige Antwort von 4
- 2 richtige Antworten von 4
- Finde die FALSCHE Aussage

Antworte mit diesem JSON:
{
  "question": "Was ist ... in folgendem Code?",
  "code": "optionaler Java-Code oder null",
  "options": ["A: ...", "B: ...", "C: ...", "D: ..."],
  "correct_indices": [0],
  "trap": "Beschreibung der Verwechslungsgefahr",
  "explanation_de": "Kurze Erklärung auf Deutsch",
  "explanation_fr": "Explication courte en français"
}`

    case 'matching':
      return `${ctx}

Erstelle eine Zuordnungsübung über "${chapter.de}".
Schreibe Java-Code mit 4 markierten Stellen (<<<1>>>, <<<2>>>, <<<3>>>, <<<4>>>).
Die Markierungen sollen wichtige Java-Konzepte aus diesem Kapitel bezeichnen.

Antworte mit diesem JSON:
{
  "instruction": "Ordne die markierten Elemente den richtigen Begriffen zu",
  "code": "Java-Code mit <<<1>>> <<<2>>> <<<3>>> <<<4>>>",
  "elements": [
    { "id": 1, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." },
    { "id": 2, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." },
    { "id": 3, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." },
    { "id": 4, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." }
  ]
}`

    case 'trueFalse':
      return `${ctx}

Erstelle 4 Wahr/Falsch-Aussagen über "${chapter.de}" auf Deutsch.
Genau 2 müssen wahr sein, 2 müssen falsch sein.
Mindestens 1 Aussage muss einen Java-Code-Ausschnitt enthalten.

Antworte mit diesem JSON:
{
  "statements": [
    { "text": "Aussage auf Deutsch", "code": null, "is_true": true, "explanation_de": "...", "explanation_fr": "..." },
    { "text": "Aussage mit Code:", "code": "String s = new String();", "is_true": false, "explanation_de": "...", "explanation_fr": "..." },
    { "text": "Aussage auf Deutsch", "code": null, "is_true": true, "explanation_de": "...", "explanation_fr": "..." },
    { "text": "Aussage auf Deutsch", "code": null, "is_true": false, "explanation_de": "...", "explanation_fr": "..." }
  ]
}`

    case 'fillBlank':
      if (fillBlankMode === 'free') {
        return `${ctx}

Erstelle eine Lückentext-Übung (OHNE Wortbank) über "${chapter.de}".
Verwende ___1___, ___2___, ___3___ für Lücken im Java-Code.
3-4 Lücken. Wichtige Java-Keywords oder Konzepte aus diesem Kapitel.

Antworte mit diesem JSON:
{
  "variant": "free",
  "instruction": "Ergänze die Lücken — ohne Hilfe",
  "code": "Java-Code mit ___1___ ___2___ ___3___",
  "blanks": [
    { "id": 1, "answer": "class", "explanation_de": "Schlüsselwort für Klassendefinition" },
    { "id": 2, "answer": "name", "explanation_de": "Attributname" },
    { "id": 3, "answer": "public", "explanation_de": "Sichtbarkeitsmodifikator" }
  ],
  "explanation_fr": "Explication globale en français"
}`
      } else {
        return `${ctx}

Erstelle eine Lückentext-Übung MIT Wortbank über "${chapter.de}".
Verwende ___1___, ___2___, ___3___ für Lücken im Java-Code.
3-4 Lücken. Die Wortbank enthält die richtigen Antworten + 2 Distraktoren.

Antworte mit diesem JSON:
{
  "variant": "assisted",
  "instruction": "Ergänze die Lücken — wähle aus der Wortbank",
  "code": "Java-Code mit ___1___ ___2___ ___3___",
  "blanks": [
    { "id": 1, "answer": "class", "explanation_de": "Schlüsselwort für Klassendefinition" },
    { "id": 2, "answer": "name", "explanation_de": "Attributname" },
    { "id": 3, "answer": "public", "explanation_de": "Sichtbarkeitsmodifikator" }
  ],
  "word_bank": ["class", "name", "public", "void", "static", "extends"],
  "explanation_fr": "Explication globale en français"
}`
      }

    case 'codeAnalysis':
      return `${ctx}

Erstelle eine Code-Analyse-Übung über "${chapter.de}".
5-12 Zeilen Java-Code. Wähle eine bestimmte Zeile (target_line).
Die Frage soll nach der genauen Funktion dieser Zeile fragen.

Antworte mit diesem JSON:
{
  "code": "public class Animal {\\n  private String name;\\n  \\n  public Animal(String name) {\\n    this.name = name;\\n  }\\n}",
  "target_line": 4,
  "question": "Was genau macht Zeile 4? Erkläre die Funktion und verwende die korrekten Fachbegriffe.",
  "expected_answer": "Zeile 4 ist der Kopf des Konstruktors...",
  "key_terms": ["Konstruktor", "Rückgabetyp", "Parameter", "String"],
  "explanation_fr": "La ligne 4 est l'en-tête du constructeur..."
}`

    default:
      return ctx
  }
}
