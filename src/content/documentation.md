# Dokumentation 

Diese Internetseite wird über die Hostingplatform Render bereitgestellt. Im nachfolgenden ein Überblick zu dem Projekt. 

## Verwendete Technologien

- **React (Javascript):** Bin ich vertraut mit, da ich es in anderen Projekten verwendet habe. Kein TSX mit Hinblick auf spätere Aufgaben die Tensorflowjs verwenden.
- **Vite:** Schnelles Build-Tool.
- **Tailwind CSS:** Einfache und schnelle Möglichkeiten zur Gestaltung der Webanwendung ohne CSS schreiben zu müssen.
- **shadcn/ui:** Dient dazu, dass Komponenten, Hover-Effekte und Animationen nicht selbst implementieren werden müssen.
- **Phosphor Icons:** Umfangreiche, schöne und kostenlose Icon-Library. Bessere Alternative zu FontAwesome meiner Meinung nach.
- **markdown-to-jsx:** Um Markdown in React-Komponenten umzuwandeln. Verwendet um die Dokumentation und Diskussion einfach in Markdown-Dokumenten zu schreiben und in die Wewanwendung rendern zu lassen.
- **TensorFlow.js (@tensorflow/tfjs)*:* Die Hauptbibliothek für das Erstellen und Trainieren der neuronalen Netze direkt im Browser.
- **TFJS VIS (@tensorflow/tfjs vis):** Eine Erweiterung zur visuellen Darstellung von Trainingsmetriken und Datenpunkten durch Scatterplots und Liniendiagramme

## Anleitung und Aufbau der Anwendung

Die Anwendung veranschaulicht den Lernprozess neuronaler Netze anhand einer festgelegten mathematischen Funktion. Der Ablauf und die Bedienung sind in mehrere Abschnitte unterteilt.

### Parameter einstellen
Im oberen Bereich der Seite befinden sich Eingabefelder für die Konfiguration der Experimente. Hier lassen sich die Anzahl der generierten Datenpaare N, die Batchgröße für das Training sowie die Epochen für die drei unterschiedlichen Modelle individuell festlegen. Ein Klick auf den Button "Training starten" generiert die Daten neu und beginnt den Lernprozess.

### Datenvisualisierung
Nach dem Start werden als Erstes die generierten Daten dargestellt. Auf der linken Seite sind die reinen Trainingsdaten und Testdaten der mathematischen Funktion ohne Rauschen zu sehen. Auf der rechten Seite werden dieselben Datenpunkte mit einem hinzugefügten Gaussschen Rauschen visualisiert.

### Trainingsfortschritt
Darunter befinden sich drei Graphen, die den Live Fortschritt des Trainings zeigen. Hier wird der Fehlerwert MSE für das Ground Truth Modell, das Best Fit Modell und das Overfit Modell pro Epoche aufgezeichnet.

### Modellvorhersagen
Sobald das Training abgeschlossen ist, wird der untere Bereich der Seite eingeblendet. Hier werden die Vorhersagen der drei Modelle detailliert mit den echten Daten verglichen. Für jedes Modell gibt es einen Graphen für die Trainingsdaten und einen für die Testdaten. Zusätzlich wird der jeweilige finale Fehlerwert unter den Diagrammen als Zahl angezeigt. So lässt sich optimal vergleichen, wie gut die Modelle generalisieren oder ob sie ein Overfitting aufweisen.
