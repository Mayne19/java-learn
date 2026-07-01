import type { Chapter, Lang } from "./chapters/types"
import { getLangLabel } from "./lang"

const JAVA_TRAPS = `- lokale Variable vs. Attribut (Instanzvariable)
- Objekt vs. Instanz vs. Klasse vs. Referenz
- Methode vs. Konstruktor vs. Funktion
- extends (Vererbung) vs. implements (Interface)
- Überschreiben (@Override) vs. Überladen (Overloading)
- statisch (static) vs. nicht-statisch`

const DYNAMIC_LANG_TRAPS = `- dynamische vs. statische Typisierung (Laufzeit vs. Kompilierzeit)
- mutable (list, dict, set) vs. immutable (tuple, str, int, bytes)
- Methode vs. Funktion vs. Built-In-Funktion
- lokale Variable vs. globale Variable (scope)
- list vs. tuple vs. set vs. dict (Unterschiede!)
- Einrückung statt {} in Python
- elif (Python) vs. else if (andere Sprachen)
- and/or/not (Python) vs. &&/||/! (Java, JavaScript)
- call-by-value vs. call-by-reference (immutable vs. mutable Objekte!)
- import vs. from...import
- try/except/else/finally — wann wird was ausgeführt?
- Cursor vs. Connection bei Datenbankzugriff`

function trapsFor(lang: Lang): string {
  return lang === "java" ? JAVA_TRAPS : DYNAMIC_LANG_TRAPS
}

// Chapters before any real code (intro, install...) must never get code in
// their questions; a couple of very early code chapters (compiling, basic
// structure) should only ever get trivial CLI/one-liner code.
function codeConstraintFor(chapter: Chapter, langLabel: string): string {
  if (chapter.hasCode === false) {
    return `\nWICHTIG: Dieses Kapitel behandelt noch KEINEN Code. Generiere NIEMALS ${langLabel}-Code (auch nicht als optionales Feld) — arbeite ausschließlich mit Fachbegriffen, Definitionen und Konzepten aus diesem Kapitel.\n`
  }
  if (chapter.simpleCodeOnly) {
    return `\nWICHTIG: Dieses Kapitel ist sehr grundlegend. Verwende nur sehr einfachen Code: Kommandozeilenbefehle oder elementarste Syntax-Beispiele (keine Klassen, Schleifen, Funktionen oder andere komplexe Konstrukte).\n`
  }
  return ""
}

function contextBlock(chapter: Chapter): string {
  const langLabel = getLangLabel(chapter.lang)

  return `Kapitel: ${chapter.de}
Programmiersprache: ${langLabel}
Schlüsselkonzepte: ${chapter.concepts.join(", ")}
Zusammenfassung: ${chapter.summary}
${codeConstraintFor(chapter, langLabel)}
Häufige Prüfungsfallen${chapter.lang === "java" ? "" : " für diesen Kurs"}:
${trapsFor(chapter.lang)}

Antworte AUSSCHLIESSLICH mit gültigem JSON. Kein Markdown, keine Backticks.`
}

export function buildPrompt(chapter: Chapter, exerciseType: string, fillBlankMode?: string): string {
  const ctx = contextBlock(chapter)
  const langLabel = getLangLabel(chapter.lang)
  const hasCode = chapter.hasCode !== false

  switch (exerciseType) {
    case "mcq":
      return `${ctx}

Erstelle eine Multiple-Choice-Frage über "${chapter.de}" auf Deutsch.
${hasCode
  ? `Die Frage kann ${langLabel}-Code enthalten (optional). Wähle ZUFÄLLIG eine dieser Varianten:`
  : `Die Frage darf KEINEN Code enthalten (code muss immer null sein). Wähle ZUFÄLLIG eine dieser Varianten:`}
- 1 richtige Antwort von 4
- 2 richtige Antworten von 4
- Finde die FALSCHE Aussage

Antworte mit diesem JSON:
{
  "question": "Was ist ... ?",
  "code": ${hasCode ? `"optionaler ${langLabel}-Code oder null"` : "null"},
  "options": ["A: ...", "B: ...", "C: ...", "D: ..."],
  "correct_indices": [0],
  "trap": "Beschreibung der Verwechslungsgefahr",
  "explanation_de": "Kurze Erklärung auf Deutsch",
  "explanation_fr": "Explication courte en français"
}`

    case "matching":
      return `${ctx}

Erstelle eine Zuordnungsübung über "${chapter.de}".
Schreibe ${langLabel}-Code mit 4 markierten Stellen (<<<1>>>, <<<2>>>, <<<3>>>, <<<4>>>).
Die Markierungen sollen wichtige ${langLabel}-Konzepte aus diesem Kapitel bezeichnen.

Wichtige Regeln für den Code:
- Der Code muss ein einfaches, GÜLTIGES Beispiel sein, das sich ausschließlich auf die oben gelisteten Schlüsselkonzepte dieses Kapitels stützt.
- Verwende KEINE Konzepte aus späteren/anderen Kapiteln, die hier noch nicht eingeführt wurden.
- Maximal 6 Zeilen Code.
- Prüfe den Code Zeile für Zeile auf syntaktische Korrektheit, bevor du antwortest — er muss so, wie er ist, unverändert lauffähig sein (abgesehen von den <<<N>>>-Markierungen).

Antworte mit diesem JSON:
{
  "instruction": "Ordne die markierten Elemente den richtigen Begriffen zu",
  "code": "${langLabel}-Code mit <<<1>>> <<<2>>> <<<3>>> <<<4>>>",
  "elements": [
    { "id": 1, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." },
    { "id": 2, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." },
    { "id": 3, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." },
    { "id": 4, "term_de": "Begriff auf Deutsch", "term_fr": "terme en français", "explanation_fr": "..." }
  ]
}`

    case "trueFalse":
      return `${ctx}

Erstelle 4 Wahr/Falsch-Aussagen über "${chapter.de}" auf Deutsch.
Genau 2 müssen wahr sein, 2 müssen falsch sein.
${hasCode
  ? `Mindestens 1 Aussage muss einen ${langLabel}-Code-Ausschnitt enthalten.`
  : `Verwende in KEINER Aussage Code (code muss immer null sein) — nur Text zu Begriffen und Definitionen.`}

Antworte mit diesem JSON:
{
  "statements": [
    { "text": "Aussage auf Deutsch", "code": null, "is_true": true, "explanation_de": "...", "explanation_fr": "..." },
    { "text": "Aussage${hasCode ? " mit Code:" : " auf Deutsch"}", "code": ${hasCode ? '"Beispielcode"' : "null"}, "is_true": false, "explanation_de": "...", "explanation_fr": "..." },
    { "text": "Aussage auf Deutsch", "code": null, "is_true": true, "explanation_de": "...", "explanation_fr": "..." },
    { "text": "Aussage auf Deutsch", "code": null, "is_true": false, "explanation_de": "...", "explanation_fr": "..." }
  ]
}`

    case "fillBlank": {
      const blankSubject = hasCode
        ? `im ${langLabel}-Code`
        : `in einem beschreibenden deutschen Satz/Text über die Begriffe dieses Kapitels (KEIN Code — Definitionslücken statt Code-Lücken)`

      if (fillBlankMode === "free") {
        return `${ctx}

Erstelle eine Lückentext-Übung (OHNE Wortbank) über "${chapter.de}".
Verwende ___1___, ___2___, ___3___ für Lücken ${blankSubject}.
3-4 Lücken. Wichtige ${hasCode ? `${langLabel}-Keywords oder Konzepte` : "Fachbegriffe"} aus diesem Kapitel.

Antworte mit diesem JSON:
{
  "variant": "free",
  "instruction": "Ergänze die Lücken — ohne Hilfe",
  "code": "${hasCode ? `${langLabel}-Code` : "Beschreibender Text"} mit ___1___ ___2___ ___3___",
  "blanks": [
    { "id": 1, "answer": "...", "explanation_de": "..." },
    { "id": 2, "answer": "...", "explanation_de": "..." },
    { "id": 3, "answer": "...", "explanation_de": "..." }
  ],
  "explanation_fr": "Explication globale en français"
}`
      } else {
        return `${ctx}

Erstelle eine Lückentext-Übung MIT Wortbank über "${chapter.de}".
Verwende ___1___, ___2___, ___3___ für Lücken ${blankSubject}.
3-4 Lücken. Die Wortbank enthält die richtigen Antworten + 2 Distraktoren.

Antworte mit diesem JSON:
{
  "variant": "assisted",
  "instruction": "Ergänze die Lücken — wähle aus der Wortbank",
  "code": "${hasCode ? `${langLabel}-Code` : "Beschreibender Text"} mit ___1___ ___2___ ___3___",
  "blanks": [
    { "id": 1, "answer": "...", "explanation_de": "..." },
    { "id": 2, "answer": "...", "explanation_de": "..." },
    { "id": 3, "answer": "...", "explanation_de": "..." }
  ],
  "word_bank": ["...", "...", "...", "...", "...", "..."],
  "explanation_fr": "Explication globale en français"
}`
      }
    }

    case "codeAnalysis":
      return `${ctx}

Erstelle eine Code-Analyse-Übung über "${chapter.de}".
5-12 Zeilen ${langLabel}-Code. Wähle eine bestimmte Zeile (target_line).
Die Frage soll nach der genauen Funktion dieser Zeile fragen.

Antworte mit diesem JSON:
{
  "code": "Mehrzeiliger ${langLabel}-Code mit \\n als Zeilentrenner",
  "target_line": 4,
  "question": "Was genau macht Zeile 4? Erkläre die Funktion und verwende die korrekten Fachbegriffe.",
  "expected_answer": "Zeile 4 ist ...",
  "key_terms": ["Begriff1", "Begriff2", "Begriff3"],
  "explanation_fr": "La ligne 4 est ..."
}`

    default:
      return ctx
  }
}
