# Dokumentation

Diese Webanwendung veranschaulicht die Textgenerierung mit einem rekurrenten neuronalen Netz (LSTM) direkt im Browser. Das Modell wurde mit TensorFlow.js in Node.js vorab trainiert.

## Vorraussetzungen

- **Datensatz / Textbasis**: Das Modell wurde auf dem Buch *"Die Tier- und Pflanzenwelt des Süsswassers. Zweiter Band."* von C. Apstein et al. trainiert.
- **Vokabular**: Nach Bereinigung aller Satzzeichen und Umwandlung aller Wörter in Kleinschreibung umfasst das Vokabular 11021 eindeutige Wörter.
- **Sequenzlänge**: Das Modell prognostiziert das nächste Wort basierend auf einer Sequenz der letzten 5 Wörter.

## Modellarchitektur

Die Netzarchitektur ist wie folgt aufgebaut:

1. **Embedding-Schicht**:
   - Initialisierer: `random-uniform`
   - Ausgabe-Dimension: 5 (Vektordarstellung der Wörter)
2. **Erste LSTM-Schicht**:
   - 100 Units
   - Gibt Sequenzen zurück (`returnSequences: true`)
3. **Zweite LSTM-Schicht**:
   - 100 Units
4. **Dense-Schicht (Ausgabeschicht)**:
   - Units: 11021 (entspricht der Vokabulargröße)
   - Aktivierungsfunktion: `softmax`

## Trainingsparameter (Wie vorgegeben)

- **Verlustfunktion (Loss)**: Categorical Cross-Entropy
- **Optimierer**: Adam mit einer Lernrate von `0.01`
- **Batch-Größe**: 32
- **Epochen**: Das finale Modell wurde über 10 Epochen trainiert.

## Modell Kennzahlen
- **Accuracy**: 0.2817
- **Loss**: 3.4432

### Top k Evaluation
- **Top 1 accuracy**: 53%
- **Top 5 accuracy**: 69.9%
- **Top 10 accuracy**: 78.6%
- **Top 100 accuracy**: 97.2%

## Verwendete Technologien

- **React (Javascript):** Bin ich vertraut mit, da ich es in anderen Projekten verwendet habe. Kein TSX mit Hinblick auf spätere Aufgaben die Tensorflowjs verwenden.
- **Vite:** Schnelles Build-Tool.
- **Tailwind CSS:** Einfache und schnelle Möglichkeiten zur Gestaltung der Webanwendung ohne CSS schreiben zu müssen.
- **shadcn/ui:** Dient dazu, dass Komponenten, Hover-Effekte und Animationen nicht selbst implementieren werden müssen.
- **Phosphor Icons:** Umfangreiche, schöne und kostenlose Icon-Library. Bessere Alternative zu FontAwesome meiner Meinung nach.
- **markdown-to-jsx:** Um Markdown in React-Komponenten umzuwandeln. Verwendet um die Dokumentation und Diskussion einfach in Markdown-Dokumenten zu schreiben und in die Wewanwendung rendern zu lassen.
- **TensorFlow.js Node (@tensorflow/tfjs-node):** Die Hauptbibliothek für das Erstellen und Trainieren der neuronalen Netze in Javascript.

## Anleitung und Aufbau der Anwendung

Das obenstehende Textfeld kann mit beliebigen Worten gefüllt werden. Ab dem 5 Wort steht eine Worterkennung zur Verfügung. Mit klick auf "Vorhersagen" werden 5 Wörter vorgeschlagen, wobei das erste Wort die höchste Wahrscheinlichkeit hat, das nächste Wort in der Sequenz zu sein. Mit klick auf "Nächstes Wort" wird das Wort mit der höchsten Wahrscheinlichkeit hinzugefügt und die Vorhersagen werden neu berechnet. Mit klick auf "Auto" werden Wörter automatisch hinzugefügt, bis 10 Wörter generiert wurden. Mit klick auf "Reset" wird der Text zurückgesetzt.