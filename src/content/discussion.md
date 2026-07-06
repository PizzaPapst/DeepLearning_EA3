# Diskussion

Ich habe zunächst probiert aus perfomancegründen mein Modell mit klassischem Python TF in Google Colab zu trainieren und anschließend in TFJS zu konvertieren. Die Konvertierung hatte leider nicht funktioniert und ich konnte das Problem auch nicht lösen. 

Ein nächster Versuch war training im Browser unter der Nutzung von WebGL. Da allerdings nur Training mit einem Tensor von 16.384 × 16.384 möglich ist, aber 30.808 × 30.808 benötigt wurde, war auch dies keine Option.

Lokales training mittels Node.js, war dann der dritte Versuch. Nach anfänglichen schwierigkeiten und langsamen geschwindigkeiten konnte tensorflow.js node korrekt eingerichtet und genutzt werden. Modelle konnte ich nun hier vortrainieren und anschließend an mein Frontend ausliefern und anwenden. 

## Trainingsprozess
Ich habe zunächst mit kleineren Datensätzen trainiert und Schrittweise die Inputgröße erhöht. AUßerdem habe ich verschiedene Parameter getestet um die Auswirkung auf Loss, Accuracy und TopK zu vergleichen. nachfolgend eine Übersicht meiner Experimente und der Auswirkung auf die Ergebnisse:

### Durchgeführte Experimente

| # | Subset | Batch | Epochen | Lernrate | Units | Loss | Accuracy | Top 1-5-10 (%) | Beobachtung |
|---|--------|-------|---------|----------|-------|------|----------|------------ |-------------|
| 1 | 20%    |32     |10       |0.01     |100    |3.96   |0.182    |45.6-69.8-77.8             |Vorgeschlagene Parameter mit kleinem Datensatz. Loss sinkt kontinuierlich, aber Accuracy relativ gering.            |
| 2 | 20%    |32     |20       |0.01     |100    |2.28      |0.4578          | 77.8-90-94.6            |Loss sinkt weiter stetig, Accuracy steigt langsam und wird besser. TopK deutlich besser als zuvor.             |
| 3 | 20%       |32       |10       |0.001       |100    | 5.25     |0.0796          |11.8-33.6-45-4             |   Niedrigere Lernrate ausgetestet. Keine besseren Ergebnisse erzielt, da bereits zuvor Loss noch sank. Für 0,001 wahrscheinlich deutlich mehr Epochen notwendig.         |
| 4 | 20%       |32       |10       |0.01       |200    |4.63      |0.13          |22.4-42-8-53             |   Erhöhung der Units auf 200 um bessere Ergebnisse zu erzielen. War nicht der Fall, könnte für großen Datensatz anders sein und müsste untersucht werden. Im weiteren Verlauf wird jedoch bei 100 Units geblieben.       |
| 5 | 20%   |64     |10       |0.01      |100    |3.77      |0.215          |51-76-86.4            | Höhere Batchgröße für schnelleres Training probiert. Keine schlechteren Ergebnisse als mit 32er Batchsize.            |
| 6 | 100%   |64     |20       |0.01      |100    |     |        |        | Das finale Modell. Beste Parameter aus vorherigen tests wurden genutzt.            |

*Hinweis: TopK misst das fertig trainierte Modell auf einer Stichprobe von 500 Beispielen.*

## Weitere Reflexion
- Der Loss des Modells nähert sich sehr schnell einem bestimmten Wert an, während der Zuwachs an Genauigkeit (Accuracy) zwischen den Epochen minimal ist.
- Die deutsche Sprache enthält sehr viele Artikel und Bindewörter. Daher sind die wahrscheinlichsten nächsten Wörter oft standardmäßig: *der*, *die*, *das*, *aber*, *und*.
- Da stets die Wörter mit den höchsten Wahrscheinlichkeiten vorgeschlagen werden, können die Vorschläge in einer Endlosschleife enden. Grade mit den zuvor genannten Artikeln ist dies ein wahrscheinliches Szenario.
- Das Hinzufügen weiterer LSTM-Schichten könnte die Genauigkeit erhöhen, da Beziehungen zwischen den Wörtern besser erfasst werden könnten.
-Erkenntnisse aus den Tests mit kleinen Datensätzen wurden auf den kompletten Datensatz übernommen. Ob diese Annahmen so 1 zu 1 übernommen werden können ist unwahrscheinlich. Eine erneute Anpassung könnte bessere Ergebnisse liefern.

### Kann es zu Datenschutzproblem kommen?

Das Modell reproduziert bei seltenen Wortfolgen teilweise exakt den Originaltext, bei häufigen eher plausible Alternativen. Dies ist ein Hinweis auf partielles Auswendiglernen statt reiner Generalisierung. Bei sensiblen statt öffentlichen Trainingsdaten könnte dieser Effekt personenbezogene Informationen ungewollt preisgeben. Grade bei wenig Trainingdaten (wie in diesem Fall), könnte das zum Problem werden.