# EA 3: Language Model mit LSTM

## Abschlussbedingungen
**Fällig:** Mittwoch, 8. Juli 2026, 08:00
**Thema** Trainieren eines Language Models (LM) zur Wortvorhersage mit einem rekurrenten Long Short-Term 
**Memory** (LSTM) Network und dem TensorFlow.js (TFJS) Framework/API.

**Bearbeitungszeit:** 30–35 Stunden, je nach Vorkenntnissen und Erfahrung.

**Voraussetzungen:** Kapitel 1–16 bis einschließlich ARC - Architectures.

**Kompetenzerwerb/Lernziele:** Nach der Bearbeitung der Aufgabe sollten Sie: 

Verstehen, wie man Sprache mit einem rekurrenten Netzwerk wie Long Short-Term Memory (LSTM) und allgemeiner in einem KI-System verarbeitet.
Wissen, was ein Language-Modell (LM) ist, und wie man ein solches trainiert.
Ein Long Short-Term Memory (LSTM) Netzwerk aufsetzen und trainieren können. 
Vorbereitung: Recherchieren Sie zu Language-Models und Wortvorhersage (Next Word Prediction), siehe Hintergrundwissen.

## Aufgabenstellung:  

Erstellen Sie ein Language Models (LM) zur Wortvorhersage. Trainieren Sie dazu als Modell ein Long Short-Term Memory (LSTM) Netzwerk auf der Basis der Daten (siehe den Punkt „Daten“ unten) zur Wortvorhersage (Next Word Prediction). Mittels des trainierten LSTM Language-Models kann autoregressiv ein Text generiert werden, in dem das jeweils vorhergesagte Wort an den vorhandenen Text angehängt wird.

Modell und Optimierung:  Nutzen Sie für Ihr Modell die folgende Netzwerkarchitektur und Parametern für den Lernalgorithmus:

Stacked LSTM: 2 hidden Layer (in sich rekursiv) mit je 100 LSTM Units (Sie können auch mit anderen/größeren Architekturen experimentieren).
Softmax Output mit der Dimension des Dictionaries.
Als Loss nutzen Sie Cross-Entropy.
Lernrate und Optimizer: Adam mit Lernrate(Learning Rate)=0.01 oder 0.001 und Batch-Size=32 (Sie können auch mit anderen experimentieren).
Anzahl der Trainings-Epochen (Epochs): Ausprobieren, dazu den Loss beobachten (Sie können dazu den Tensorflow (TF) Visor nutzen).

## Interaktion: 

- I1: Der Nutzer kann einen Text (Prompt) eingeben. Dieser sollte nur aus vollständigen, durch Leerzeichen getrennten Wörtern (Tokens) bestehen. Er kann dann jederzeit (am Ende eines vollständig eingegebenen Wortes) den Button „Vorhersage“ betätigen und erhält eine Darstellung der wahrscheinlichsten nun folgenden Wörter mit deren Wahrscheinlichkeiten. Er kann eines dieser Wörter auswählen, sodass es an den Text angehängt wird. Daraufhin beginnt automatisch eine neue Wortvorhersage.

- I2: Der Nutzer kann mittels des „Weiter“ Buttons das wahrscheinlichste vorhergesagte Wort annehmen. Diese wird an den bisher eingegebenen Text angehängt, darauf beginnt automatisch eine neue Wortvorhersage. Der Nutzer kann also über wiederholtes Betätigen des „Weiter“ Buttons einen Text generieren lassen.

- I3: Der Nutzer kann über einen „Auto“ Button automatisch bis zu 10 Wörter vorhersagen lassen. Diese automatische Vorhersage kann mittels eines „Stopp“ Buttons unterbrochen werden.

- I4: Über ein „Reset“ Button werden der eingegebene Text und das Netzwerk zurückgesetzt.

Buttons: I1 Vorhersage, I2 Weiter, I3 Auto, Stopp und I1 die Auswahl eines der nächsten Wörter.

## Experimente und Fragestellungen: 

1) Experimentieren Sie mit der Netzwerkarchitektur. Dokumentieren und begründen Sie Ihre finale Architektur.

2) Notieren Sie als Resultat, wie oft die Vorhersage genau richtig ist (k=1), und wie oft das korrekte nächste Wort unter den ersten k Worten, die Sie vorhersagen liegt, mit k gleich 5, 10, 20 und 100. Sie können auch die Perplexity (siehe Hintergrund) als Maß Ihrer Resultate nutzen.

3) Können Sie Ihre ursprünglichen Trainingsdaten mittels des trainierten Models rekonstruieren?  (überlegen Sie, ob sich daraus ein Datenschutzproblem ergibt).

**Visualisierung:** Sie können, dazu außer der API von TF, z. B. folgende Bibliotheken zur Visualisierung der Ergebnisse als Diagramm nutzen: Plotly, D3.

**Diskussion:** Diskutieren Sie Ihre Ergebnisse (unter den Resultaten auf der gleichen HTML-Seite, max. 10 Sätze). Was haben Sie beobachtet/gelernt? 

Dokumentation: Nutzen Sie die gleiche HTML-Seite (unter der Diskussion) wie zur Abgabe Ihrer Lösung zur Dokumentation der folgenden Aspekte:

1) Technisch: Listen Sie alle verwendeten Frameworks auf und erklären Sie kurz (1–3 Sätze) wozu Sie diese verwenden. Dokumentieren Sie technische Besonderheiten Ihrer Lösung.

2) Fachlich: Erläutern Sie Ihre Implementierung der Logik und alles, was für ihre Lösung wichtig ist (Ansatz, Resultate, Quellen, etc.)

Schreiben Sie bitte nichts in die Moodle Abgabe-Felder.

**Hinweise:** 

Wortvorhersage ist eine Multi-Class Classification. Nutzen Sie als Objektivfunktion den Categorical Cross-Entropy Loss. 

Starten Sie mit wenigen Daten, also einem kurzen Text. Schauen Sie sich die Accuracy für die k Werte an. Probieren Sie dann mehr Daten hinzuzufügen. 

**Fehlerbehandlung, Test und QA:** Stellen Sie sicher, dass die Eingabe das richtige Format hat.

**Daten:** Wählen Sie aus den folgenden Datensätzen (oder nutzen Sie einen eigenen):

- Internet Archive → Books
- CC100 German:  https://datasets.quantumstat.com/ (Paper: Learning multilingual named entity recognition from Wikipedia)
- Plenarprotokolle des Deutschen Bundestags: https://www.bundestag.de/services/opendata
- German-language E-Mail corpus
- Bücher aus dem Projekt Gutenberg: https://www.gutenberg.org/
- 10k German News Articles: https://www.kaggle.com/datasets/abhishek/10k-german-news-articles/data
**User Experience (UX):**  Beachten Sie die Human/Mensch-Computer-Interaction (HCI) Kriterien beim Interaktionsdesign: ISO 9241-11 Anforderungen an die Gebrauchstauglichkeit und ISO 9241-110 Interaktionsprinzipien. Ihre Anwendung sollte funktional (Aufgabenangemessenheit) und benutzerfreundlich (Usability) und mit angemessenem Feedback und einer [kontextsensitive] Hilfe ausgestattet sein.

**Gestaltung:** Achten Sie auf eine sinnvolle Semantik bei der Farbgestaltung und ein übersichtliches Layout. Siehe dazu: material.io - Design Guidance and Code

**Libraries:** Sie können, dazu außer der API von TF (Visor), z. B. folgende Bibliotheken nutzen: Plotly, D3, Chart.js, etc.

Arbeitsumgebung: JS-, HTML-IDE (z. B. Atom, WebStorm, Visual Studio Code), [local] Web-Server.

Zum Lernen auf einem Server, z. B.: Google colab

**Hintergrundwissen:** 

Loss

https://gombru.github.io/2018/05/23/cross_entropy_loss/

Next Word Prediction

https://towardsdatascience.com/next-word-prediction-with-nlp-and-deep-learning-48b9fe0a17bf
Building a Next Word Predictor in Tensorflow
Language Model (LM)

T. Mikolov  et.al., Recurrent neural network based language model 
https://en.wikipedia.org/wiki/Language_model 
https://towardsdatascience.com/language-models-1a08779b8e12 
https://medium.com/syncedreview/language-model-a-survey-of-the-state-of-the-art-technology-64d1a2e5a466
Context based Text-generation using LSTM networks
Perplexity for LM

https://homes.cs.washington.edu/~nasmith/papers/plm.17.pdf

https://leimao.github.io/blog/Entropy-Perplexity/

Coding:  

Danfo.js for manipulating and processing data (like Pandas for Python)
Next Word Prediction with NLP and Deep Learning
A Simple Autocomplete Model
https://github.com/seyedsaeidmasoumzadeh/Predict-next-word
https://www.tensorflow.org/js/demos
NLP Keras model in browser with TensorFlow.js
How to create a language translator using Tensorflow.JS
lstm-text-generation
translation
sentiment
jena-weather
Arbeitsumgebung: JS-, HTML-IDE (z. B. Atom, WebStorm, Visual Studio Code), [local] Web-Server.

Testumgebung: Chrome [unter macOS].

Bewertungskriterien und Punkte: 

Funktionsfähigkeit und Vollständigkeit der Anwendung entsprechend der Aufgabenstellung (15 Punkte)
Modellperformance (5 Punkte)
Experimente, Resultate und Diskussion (10 Punkte)
Dokumentation, technisch und fachlich (5 Punkte)
User Experience (UX) und User Interaktion (HCI, Interaktionsdesign, Dialoggestaltung, Usability, Hilfe) (5 Punkte)
Gestaltung und Visualisierung (Farben, Formen, Screen-Layout, Text, Semantik) (5 Punkte)
Gesamtpunktzahl: 45 Punkte