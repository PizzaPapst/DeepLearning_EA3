// C++ Backend ZUERST laden (MUSS vor tf import stehen!)
try {
  await import('@tensorflow/tfjs-node');
  console.log("Erfolgreich: C++ Backend (@tensorflow/tfjs-node) geladen.");
} catch (e) {
  console.log("Info: C++ Backend nicht gefunden. Verwende Standard-CPU-Backend (langsamer).");
}
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';

// --- KONFIGURATION FÜR DAS TRAINING ---
// SCHNELL-TEST: EPOCHS=1, MAX_SEQUENCES=20000, EMBEDDING_DIM=32, LSTM_UNITS=64
// FINALES TRAINING: EPOCHS=10, MAX_SEQUENCES=null (alle), EMBEDDING_DIM=50, LSTM_UNITS=100
const EPOCHS = 1;
const BATCH_SIZE = 512;
const MAX_SEQUENCES = 20000; // null = alle Sequenzen nutzen
const EMBEDDING_DIM = 32;    // 50 für finales Training
const LSTM_UNITS = 64;       // 100 für finales Training

// Pfade definieren (relativ zur App-Root)
const corpusPath = 'TierUndPflanzenwelt.txt';
const vocabOutputPath = path.join('public', 'vocab.json');
const modelOutputDir = path.join('public', 'model');

// Textbereinigung (exakt passend zur Web-App-Logik)
function getCleanTokens(rawText) {
  return rawText.toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/[!?,.:;()'"\-\[\]=+\d]/g, ""))
    .filter(word => word.length > 0 && /^[a-zäöüß]+$/.test(word));
}

async function startTraining() {
  console.log("Lade Textkorpus...");
  if (!fs.existsSync(corpusPath)) {
    console.error(`Fehler: Textdatei unter ${corpusPath} wurde nicht gefunden!`);
    console.error("Bitte stelle sicher, dass 'TierUndPflanzenwelt.txt' im Hauptordner liegt.");
    process.exit(1);
  }

  const rawText = fs.readFileSync(corpusPath, 'utf-8');
  console.log("Bereinige Text...");
  const tokens = getCleanTokens(rawText);
  console.log(`Anzahl Wörter nach Bereinigung: ${tokens.length}`);

  // Vokabular und Sequenzen erstellen
  console.log("Erstelle Sequenzen und Vokabular...");
  const wordIndex = {};
  const indexWord = {};
  let wordCounter = 1;

  const sequences = [];
  const autoWordsCount = 6; // 5 Eingabewörter + 1 Zielwort

  for (let i = autoWordsCount; i < tokens.length; i++) {
    const seq = tokens.slice(i - autoWordsCount, i);
    sequences.push(seq);

    for (const word of seq) {
      if (!wordIndex[word]) {
        wordIndex[word] = wordCounter;
        indexWord[wordCounter] = word;
        wordCounter++;
      }
    }
  }

  const vocabSize = wordCounter;
  console.log(`Sequenzen erstellt: ${sequences.length}`);
  console.log(`Eindeutige Wörter im Vokabular: ${vocabSize - 1}`);

  // Vokabular speichern
  console.log(`Speichere Vokabular unter ${vocabOutputPath}...`);
  fs.writeFileSync(vocabOutputPath, JSON.stringify({ wordIndex, indexWord }, null, 2), 'utf-8');

  // Datensatz für das Training vorbereiten
  const xs = [];
  const ys = [];

  const seqLimit = MAX_SEQUENCES ? sequences.slice(0, MAX_SEQUENCES) : sequences;
  console.log(`Nutze ${seqLimit.length} von ${sequences.length} Sequenzen für das Training.`);

  for (const seq of seqLimit) {
    const encoded = seq.map(w => wordIndex[w] || 0);
    xs.push(encoded.slice(0, 5));
    ys.push([encoded[5]]);
  }

  // Konvertierung in TensorFlow-Tensoren
  const X = tf.tensor2d(xs, [xs.length, 5], 'int32');
  const Y = tf.tensor2d(ys, [ys.length, 1], 'float32');

  // LSTM-Modell definieren
  console.log("Definiere Modell...");
  const model = tf.sequential();
  
  // Embedding-Schicht
  model.add(tf.layers.embedding({
    inputDim: vocabSize,
    outputDim: EMBEDDING_DIM,
    inputShape: [5]
  }));

  // Stacked LSTM Schichten
  model.add(tf.layers.lstm({
    units: LSTM_UNITS,
    returnSequences: true
  }));
  model.add(tf.layers.lstm({
    units: LSTM_UNITS
  }));

  // Dense Ausgangsschicht mit Softmax
  model.add(tf.layers.dense({
    units: vocabSize,
    activation: 'softmax'
  }));

  // Kompilieren mit sparseCategoricalCrossentropy (spart massiven RAM!)
  model.compile({
    optimizer: 'adam',
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });

  model.summary();

  // Training
  console.log(`Starte Training für ${EPOCHS} Epochen mit Batch-Größe ${BATCH_SIZE}...`);

  let finalLoss = 0;
  await model.fit(X, Y, {
    epochs: EPOCHS,
    batchSize: BATCH_SIZE,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        finalLoss = logs.loss;
        console.log(`Epoche ${epoch + 1}/${EPOCHS} - loss: ${logs.loss.toFixed(4)} - accuracy: ${logs.acc.toFixed(4)}`);
      }
    }
  });

  // Modell abspeichern
  console.log(`Speichere Modell in ${modelOutputDir}...`);
  if (!fs.existsSync(modelOutputDir)) {
    fs.mkdirSync(modelOutputDir, { recursive: true });
  }
  await model.save(`file://${modelOutputDir}`);
  
  // TFJS Kompatibilitäts-Fix für den Browser
  const modelJsonPath = path.join(modelOutputDir, 'model.json');
  if (fs.existsSync(modelJsonPath)) {
    let modelJsonStr = fs.readFileSync(modelJsonPath, 'utf-8');
    modelJsonStr = modelJsonStr.replace(/"batch_shape":/g, '"batchInputShape":');
    fs.writeFileSync(modelJsonPath, modelJsonStr, 'utf-8');
  }
  console.log("Modell erfolgreich lokal gespeichert!");

  // Evaluierung (Top-k Genauigkeiten & Perplexität berechnen)
  console.log("\nStarte Evaluierung (Top-k-Genauigkeiten und Perplexität)...");
  
  const kValues = [1, 5, 10, 20, 100];
  const correctCounts = { 1: 0, 5: 0, 10: 0, 20: 0, 100: 0 };
  const totalSamples = xs.length;
  const evalBatchSize = 512;

  for (let i = 0; i < totalSamples; i += evalBatchSize) {
    const end = Math.min(i + evalBatchSize, totalSamples);
    const batchX = tf.tensor2d(xs.slice(i, end), [end - i, 5], 'int32');
    const batchY = ys.slice(i, end).map(item => item[0]);

    // Vorhersagen berechnen
    const predictions = model.predict(batchX);
    const predData = await predictions.data();
    const batchLen = end - i;

    for (let b = 0; b < batchLen; b++) {
      const startIdx = b * vocabSize;
      const probs = Array.from(predData.slice(startIdx, startIdx + vocabSize))
        .map((p, idx) => ({ id: idx, p }));

      // Absteigend nach Wahrscheinlichkeit sortieren
      probs.sort((a, b) => b.p - a.p);

      const trueId = batchY[b];
      for (const k of kValues) {
        const topKIds = probs.slice(0, k).map(item => item.id);
        if (topKIds.includes(trueId)) {
          correctCounts[k]++;
        }
      }
    }

    batchX.dispose();
    predictions.dispose();
  }

  console.log("\n=================================");
  console.log("      EVALUIERUNGSERGEBNISSE     ");
  console.log("=================================");
  for (const k of kValues) {
    const acc = (correctCounts[k] / totalSamples) * 100;
    console.log(`Top-${k} Genauigkeit (k=${k}): ${acc.toFixed(2)}%`);
  }
  const perplexity = Math.exp(finalLoss);
  console.log(`Perplexität (Perplexity):   ${perplexity.toFixed(2)}`);
  console.log("=================================");

  // Speicher freigeben
  X.dispose();
  Y.dispose();
}

startTraining().catch(err => {
  console.error("Fehler beim Training:", err);
});
