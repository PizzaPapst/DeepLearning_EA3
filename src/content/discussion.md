# Diskussion

Das Trainieren der Modelle mit TFJS und die Darstellung über TFJS VIS haben erstaunlich gut funktioniert. Größere Probleme hatte ich dann allerdings beim Einstellen der richtigen Parameter.

Das Lernen auf den Ground Truth Daten hat gut funktioniert und stets gute Ergebnisse geliefert. Hier kann natürlich kein Overfitting auftreten, da kein Fehler in den Trainingsdaten besteht, den unser Netzwerk erlernen könnte. Daher waren auch hier die Vorhersagen auf Trainingsdaten sowie auf Testdaten stets ähnlich und in einem sehr niedrigen Fehlerbereich (MSE < 0.05).

Beim Bestfit Modell mit verrauschten Daten war das Ganze schon etwas schwieriger. Mit den richtigen Parametereinstellungen war es schließlich auch hier möglich, gute Ergebnisse zu erzielen. Der MSE lag für Trainingsdaten und Testdaten bei ungefähr 0,1. Die Gefahr bestand bereits bei diesem Modell, in ein Overfitting zu geraten. Für mich hat es mit 80 bis 100 Epochen gut gepasst und verlässliche Ergebnisse erzeugt.

Das Overfit Modell war das anspruchsvollste, da der Unterschied zwischen Trainingsdaten und Testdaten stets klein blieb und kein wirklich starker Overfitting Effekt erzielt werden konnte. Oft lagen die Vorhersagen auf den Trainingsdaten bei einem MSE von circa 0,04 und auf den Testdaten bei 0,08. Ich habe probiert, diesen Effekt durch verschiedenste Einstellungen zu verstärken. Allerdings erzielte ich weder bei sehr vielen Epochen (>1000), noch bei anderen Batchgrößen oder anderen Neuronenschichten (64 auf 32) deutlichere Effekte. Meine Vermutung ist, dass die Daten eventuell zu wenig verrauscht sind und der Fehler dadurch nicht so hoch ausfällt. Alternativ könnten 100 Datenpaare auf einem relativ kleinen Intervall bereits genug Datenpunkte liefern, um das zugrunde liegende Verhalten gut lernen zu können. Ein testweises Verringern auf N=50 Datenpaare hat den Effekt deutlicher gemacht, führte aber auch bei den anderen Modellen zu sichtbar schlechteren Ausgaben.

Ein Punkt, der mir generell aufgefallen ist, sind die unterschiedlichen Ergebnisse des Lernens und Vorhersagens auf Basis der zufällig erstellten Datenpunkte. Je nach Durchlauf waren die Ergebnisse bei exakt gleichen Parametern deutlich besser oder schlechter als in vorherigen Versuchen.

## Parameter
- N = 100 Datenpaare waren schon eine Gute Trainingsgrundlage auf dem Intervall -2 bis 2. Wurde dabei belassen.
- Die zwei Schichten mit je 100 Neuronen und ReLU ermöglichen dem Netz die kurvige Form richtig zu lernen. Sigmoid lieferte schlechtere Ergebnisse. Weniger Neuronen gingen auch z.B. 64->32
- Der Adam Optimizer mit einer Lernrate von 0.01 war vorgegeben, ging auch gut damit.
- 32er Batches waren ein guter Mittelweg für schnelle und regelmäßige Updates. Ebenfalls vorgegeben.
- Für das Ground Truth und das Best Fit Modell reichen 100 Epochen aus, um gute Ergebnisse zu finden.
- Beim Overfit Modell sind 220 Epochen die Standardeinstellung, damit das Netz das rauschen mitlernt.