# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Einsendeaufgabe 1 – Bilderkennung (Klassifikation) mit dem ml5 Framework

**Bearbeitungszeit:** 15–20 Stunden, je nach Vorkenntnissen und Erfahrung.

**Voraussetzungen:** Kapitel 1 und 2 bis einschließlich *Learning from Data*.

---

## Lernziele

Nach der Bearbeitung der Aufgabe sollten Sie:

- Ihr Wissen über Web-Anwendungen wieder aufgefrischt haben und — besonders durch den Austausch mit anderen — neue nützliche Tipps und Frameworks kennengelernt haben.
- Wissen, wie man ein vor-trainiertes KI-Modell für eine Web-Anwendung nutzt.

**Vorbereitung:** Verschaffen Sie sich einen Überblick über das [ml5.js Framework](https://ml5js.org/). Vollziehen Sie das *Image Classification Tutorial* nach.

---

## Aufgabenstellung

Erweitern Sie das ml5 Image Classification Tutorial *(es gibt auch eine neuere Version, siehe Coding und Tutorials)* so, dass ein Nutzer beliebige Bilder klassifizieren kann. Sie verwenden dazu — wie im Tutorial — ein bestehendes, vor-trainiertes Modell. Sie müssen also **nichts selbst trainieren/anlernen**.

### A1 – Beispiel-Bilder

Zeigen Sie **Beispiel-Bilder**, jeweils **drei** für korrekte und **drei** für falsche Klassifikation, zusammen mit den Ergebnissen der Klassifikation als Diagramm (siehe [Resultate und Visualisierung](#resultate-und-visualisierung)).

- Die Klassifikation wird direkt in der Anwendung berechnet.
- Machen Sie bei der Darstellung deutlich, welche Bilder korrekt oder falsch klassifiziert werden.
- Die Bilder können aus dem ImageNet-Datensatz (zum Image Classification Tutorial) stammen oder von Ihnen kommen. Sie können Bilder auch künstlich modifizieren.

### A2 – Nutzer-Upload

Der Nutzer soll ein **eigenes Bild** in die Anwendung laden und klassifizieren lassen können (siehe [Interaktion](#interaktion)).

---

## Interaktion

Der Nutzer kann ein Bild zur Klassifikation:

- **hochladen** (Datei-Dialog), oder
- per **Drag-and-Drop** in die Anwendung ziehen.

Das Bild wird zunächst dargestellt und anschließend automatisch oder mittels eines **„Classify"-Buttons** klassifiziert.

---

## Resultate und Visualisierung

Das Netzwerk gibt eine **Wahrscheinlichkeitsverteilung** aus. Diese Werte können als *Confidence* interpretiert werden. Sie stellen die Confidence als Klassifikationsergebnis in Form eines **Diagramms** (Balken-, Pie-, etc.) dar.

- In den Diagrammen sollen die **Zahlenwerte der Confidence in Prozent** für die dargestellten Klassen stehen.
- Zur Visualisierung können Sie Bibliotheken wie **Plotly** oder **Chart.js** nutzen (siehe [Libraries](#libraries)).

---

## Layout

Stellen Sie Ihre Lösung in **zwei Spalten** dar: links das Bild, rechts das Diagramm mit der Klassifikation.

| Bereich | Inhalt |
|---------|--------|
| **R1** | Zunächst die drei richtig klassifizierten Bilder übereinander, dann die drei falschen Klassifizierungen. |
| **R2** | Darunter das vom Nutzer geladene Bild mit den zugehörigen Interaktionselementen. |

---

## Diskussion

Diskutieren Sie Ihre Ergebnisse **unter den Resultaten auf der gleichen HTML-Seite** (max. 10 Sätze):

- Was haben Sie beobachtet/gelernt?
- Bei welchen Bildern hat die Klassifikation funktioniert und bei welchen nicht — und warum?

---

## Dokumentation

Nutzen Sie **dieselbe HTML-Seite** (unter der Diskussion) zur Dokumentation der folgenden Aspekte:

### 1. Technisch

Listen Sie alle verwendeten Frameworks auf und erklären Sie kurz (1–3 Sätze), wozu Sie diese verwenden. Dokumentieren Sie auch technische Besonderheiten Ihrer Lösung.

### 2. Fachlich

Erläutern Sie Ihre Implementierung der Logik und alles, was für Ihre Lösung wichtig ist (Ansatz, Resultate, Quellen, etc.).

> **Bitte nichts in die Moodle-Abgabe-Felder schreiben.**

---

## Anwendung und Abgabe

Sie erstellen eine **Web-Anwendung** und stellen diese auf einem **öffentlichen Web-Server** bereit (siehe Kursplan und [Web-Anwendungen und Frameworks: Client-side Web APIs by MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs)).

---

## Hinweise

- Das ml5 Framework ist ein High-Level-API zu TensorFlow (TF) bzw. TFJS. Für mehr Kontrolle über die Logik der Anwendung muss eine tiefere Schnittstelle/API gewählt werden.
- **Fehlerbehandlung, Test und QA:** Prüfen Sie, dass die Bilder das richtige Format haben.

### User Experience (UX)

Beachten Sie die **HCI-Kriterien** beim Interaktionsdesign:

- [ISO 9241-11](https://www.iso.org/standard/63500.html) – Anforderungen an die Gebrauchstauglichkeit
- [ISO 9241-110](https://www.iso.org/standard/75258.html) – Interaktionsprinzipien

Ihre Anwendung sollte:

- **Funktional** sein (Aufgabenangemessenheit)
- **Benutzerfreundlich** sein (Usability)
- Mit angemessenem **Feedback** und einer **kontextsensitiven Hilfe** ausgestattet sein.

### Gestaltung

- Achten Sie auf eine sinnvolle **Semantik bei der Farbgestaltung** und ein übersichtliches Layout.
- Referenz: [Material Design – material.io](https://m3.material.io/)

---

## Daten

ImageNet-Datensatz aus dem Tutorial für Beispiel-Bilder:

| Ressource | Link |
|-----------|------|
| Paper | [arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575) |
| Dataset | [image-net.org](https://www.image-net.org/index.php) |
| Challenges | [LSVRC Challenges](https://www.image-net.org/challenges/LSVRC/) |

---

## Zusätzliches Hintergrundwissen

- **Paper zu MobileNets** for Mobile Vision Applications: [arxiv.org/abs/1704.04861](https://arxiv.org/abs/1704.04861)

---

## Libraries

- [Chart.js](https://www.chartjs.org/)
- [Plotly.js](https://plotly.com/javascript/)

---

## Coding und Tutorials

- [ml5.js Examples](https://ml5js.org/) *(neue Version, aber nicht so ausführlich)*

---

## Arbeitsumgebung

- **IDE:** JS-/HTML-IDE (z. B. Atom, WebStorm, Visual Studio Code)
- **Web-Server:** Lokaler Web-Server

**Testumgebung:** Chrome [unter macOS]

---

## Bewertungskriterien und Punkte

Bewertet werden **Logik**, **User Experience (UX)** und **Gestaltung**:

| Kriterium | Punkte |
|-----------|--------|
| Funktionsfähigkeit und Vollständigkeit der Anwendung entsprechend der Aufgabenstellung | 8 |
| Experimente, Resultate und Diskussion; Auswahl geeigneter und interessanter Beispiele | 8 |
| Dokumentation (technisch und fachlich) | 3 |
| User Experience (UX) und User Interaktion (HCI, Interaktionsdesign, Dialoggestaltung, Usability, Hilfe) | 3 |
| Gestaltung und Visualisierung (Farben, Formen, Screen-Layout, Text, Semantik) | 3 |
| **Gesamtpunktzahl** | **25** |