import React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function Learning() {
  // States zum Rendering
  const [groundTruthPredictTrainMse, setGroundTruthPredictTrainMse] = useState(0)
  const [groundTruthPredictTestMse, setGroundTruthPredictTestMse] = useState(0)
  const [bestfitPredictTrainMse, setBestfitPredictTrainMse] = useState(0)
  const [bestfitPredictTestMse, setBestfitPredictTestMse] = useState(0)
  const [overfitPredictTrainMse, setOverfitPredictTrainMse] = useState(0)
  const [overfitPredictTestMse, setOverfitPredictTestMse] = useState(0)
  const [trainedModels, setTrainedModels] = useState({
    clean: null,
    best: null,
    overfit: null
  });
  
  const [initialLearning, setInitialLearning] = useState(false)
  const [learningRunning, setLearningRunning] = useState(false)
  const [learningDone, setLearningDone] = useState(false)

  const [batchSize, setBatchSize] = useState(32)
  const [epoches, setEpoches] = useState({
    groundTruth: 100,
    bestfit: 80,
    overfit: 220 
  })
  const [dataPoints, setDataPoints] = useState(100)
  
  // Refs für die Chart-Container
  const groundTruthRef = useRef(null);
  const noisyDataRef = useRef(null);
  const trainingChartClean= useRef(null);
  const trainingChartBest = useRef(null);
  const trainingChartOverfit = useRef(null);
  const GroundTruthPredictTestRef = useRef(null);
  const GroundTruthPredictTrainRef = useRef(null);
  const BestfitPredictTrainRef = useRef(null);
  const BestfitPredictTestRef = useRef(null);
  const OverfitPredictTrainRef = useRef(null);
  const OverfitPredictTestRef = useRef(null);

  // Hilfsfunktionen
  const groundTruth = (x) => {
        return 0.5 * (x + 0.8) * (x + 1.8) * (x - 0.2) * (x - 0.3) * (x - 1.9) + 1;
      };

  const nextGaussian = (mean = 0, stdDev = 1) => {
        const u1 = Math.random();
        const u2 = Math.random();
        const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return mean + stdDev * randStdNormal;
      };

  function generateData(n){
    const N = n;
    const minX = -2;
    const maxX = 2;
    const rawData = [];

    // Daten generieren lassen auf Intervall (-2, 2)
    for (let i = 0; i < N; i++) {
      const x = minX + Math.random() * (maxX - minX); 
      const y = groundTruth(x);
      rawData.push({ x, y });
    }

    // VOR dem Slicen mischen, damit der Split wirklich zufällig ist
    for (let i = rawData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawData[i], rawData[j]] = [rawData[j], rawData[i]];
    }

    // Daten teilen
    const trainDataRaw = rawData.slice(0, N / 2);
    const testDataRaw = rawData.slice(N / 2); 

    const variance = 0.05;
    const stdDev = Math.sqrt(variance); // ca. 0.2236

    const addNoise = (dataArray) => {
      return dataArray.map(point => ({
        x: point.x,
        yClean: point.y, 
        yNoisy: point.y + nextGaussian(0, stdDev) 
      }));
    };

    const trainDataProcessed = addNoise(trainDataRaw);
    const testDataProcessed = addNoise(testDataRaw);

    // Tensoren erstellen
    const trainX = tf.tensor2d(trainDataProcessed.map(d => d.x), [N / 2, 1]);
    const trainYClean = tf.tensor2d(trainDataProcessed.map(d => d.yClean), [N / 2, 1]);
    const testX = tf.tensor2d(testDataProcessed.map(d => d.x), [N / 2, 1]);
    const testYClean = tf.tensor2d(testDataProcessed.map(d => d.yClean), [N / 2, 1]);

    const trainYNoisy = tf.tensor2d(trainDataProcessed.map(d => d.yNoisy), [N / 2, 1]);
    const testYNoisy = tf.tensor2d(testDataProcessed.map(d => d.yNoisy), [N / 2, 1]);

    // Ohne Rauschen Rendern
    if (groundTruthRef.current) {
      const trainCleanSeries = trainDataProcessed.map(d => ({ x: d.x, y: d.yClean }));
      const testCleanSeries = testDataProcessed.map(d => ({ x: d.x, y: d.yClean }));

      tfvis.render.scatterplot(
        groundTruthRef.current,
        { 
          values: [trainCleanSeries, testCleanSeries], 
          series: ['Trainingsdaten', 'Testdaten'] 
        },
        {
          xLabel: 'X-Werte',
          yLabel: 'Y-Werte',
          height: 400,
          zoomToFit: true
        }
      );
    }

    // Mit Rauschen Rendern
    if (noisyDataRef.current) {
      const trainNoisySeries = trainDataProcessed.map(d => ({ x: d.x, y: d.yNoisy }));
      const testNoisySeries = testDataProcessed.map(d => ({ x: d.x, y: d.yNoisy }));

      tfvis.render.scatterplot(
        noisyDataRef.current,
        { 
          values: [trainNoisySeries, testNoisySeries], 
          series: ['Trainingsdaten', 'Testdaten'] 
        },
        {
          xLabel: 'X-Werte',
          yLabel: 'Y-Werte',
          height: 400,
          zoomToFit: true
        }
      );
    }

    const trainTensors = {x: trainX, yClean: trainYClean, yNoisy: trainYNoisy}
    const testTensors = {x: testX, yClean: testYClean, yNoisy: testYNoisy}


    return [trainTensors, testTensors]
  }

  async function runApp(){
    setInitialLearning(true)
    setLearningRunning(true)
    setLearningDone(false)

    const data = generateData(dataPoints)

    const [trainTensors, testTensors] = data
    
    // Modelle erstellen
    const modelClean = createModel();
    const bestModel = createModel();
    const overfitModel = createModel();
    

    const currentBatchSize = parseInt(batchSize, 10);
    const epochsClean = parseInt(epoches.groundTruth, 10);
    const epochsBest = parseInt(epoches.bestfit, 10);
    const epochsOverfit = parseInt(epoches.overfit, 10);

    // Modelle trainieren
    // 1. Ground Truth Modell trainieren und Status setzen
    await trainModel(modelClean, trainTensors.x, trainTensors.yClean, trainingChartClean.current, currentBatchSize, epochsClean);
    setTrainedModels(prev => ({ ...prev, clean: modelClean }));

    // 2. Best-Fit Modell trainieren und Status setzen
    await trainModel(bestModel, trainTensors.x, trainTensors.yNoisy, trainingChartBest.current, currentBatchSize, epochsBest);
    setTrainedModels(prev => ({ ...prev, best: bestModel }));

    // 3. Overfit Modell trainieren und Status setzen
    await trainModel(overfitModel, trainTensors.x, trainTensors.yNoisy, trainingChartOverfit.current, currentBatchSize, epochsOverfit);
    setTrainedModels(prev => ({ ...prev, overfit: overfitModel }));
    

    setLearningRunning(false)
    setLearningDone(true)

    // Vorhersagen treffen
    await testModel(modelClean, trainTensors.x, trainTensors.yClean, GroundTruthPredictTrainRef, setGroundTruthPredictTrainMse)
    await testModel(modelClean, testTensors.x, testTensors.yClean, GroundTruthPredictTestRef, setGroundTruthPredictTestMse)
    await testModel(bestModel, trainTensors.x, trainTensors.yNoisy, BestfitPredictTrainRef, setBestfitPredictTrainMse)
    await testModel(bestModel, testTensors.x, testTensors.yNoisy, BestfitPredictTestRef, setBestfitPredictTestMse)
    await testModel(overfitModel, trainTensors.x, trainTensors.yNoisy, OverfitPredictTrainRef, setOverfitPredictTrainMse)
    await testModel(overfitModel, testTensors.x, testTensors.yNoisy, OverfitPredictTestRef, setOverfitPredictTestMse)
  }

  function createModel() {
    const model = tf.sequential();

    // Ein tieferes FFNN, um die Wellenform der Funktion lernen zu können:
    model.add(tf.layers.dense({ inputShape: [1], units: 100, activation: 'relu', useBias: true }));
    model.add(tf.layers.dense({ units: 100, activation: 'relu', useBias: true }));
    model.add(tf.layers.dense({ units: 1, useBias: true })); // Output-Layer (linear für Regression)

    return model;
  }

  async function trainModel(model, inputs, labels, chartContainer, batchSize, epochs) {
    model.compile({
      optimizer: tf.train.adam(0.01), // Lernrate erhöht für schnelleres Lernen bei wenigen Epochen
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });

    const lossHistory = [];

    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          lossHistory.push({ x: epoch + 1, y: logs.loss });

          if (chartContainer) {
            tfvis.render.linechart(
              chartContainer,
              { 
                values: [lossHistory], 
                series: ['Trainings-Verlust (MSE)'] 
              },
              {
                xLabel: 'Epoche',
                yLabel: 'Fehler (Loss)',
                height: 400,
                zoomToFit: true
              }
            );
          }
        }
      }
    });
  }

  async function testModel(model, testXTensor, testYTensor, chartContainer, setMse) {
    // 1. Vorhersage machen: Wir füttern das Modell mit den 50 Test-X-Werten
    const predictions = model.predict(testXTensor);

    // 2. Die 50 vorhergesagten Y-Werte aus dem GPU-Speicher in ein Array laden
    const [xValues, actualYValues, predictedYValues] = await Promise.all([
        testXTensor.data(),
        testYTensor.data(),
        predictions.data()
    ]);

    // 3. Daten für das Diagramm aufbereiten
    // A) Die echten Testpunkte (X und verrauschtes Y)
    
    const actualPoints = Array.from(xValues).map((xVal, i) => ({ 
        x: xVal, 
        y: actualYValues[i] 
    }));

    const predictedPoints = Array.from(xValues).map((xVal, i) => ({
        x: xVal,
        y: predictedYValues[i] 
    }));

    const evalResult = model.evaluate(testXTensor, testYTensor);
    const mseTensor = evalResult[0];
    const mseValue = mseTensor.dataSync()[0];
    setMse(mseValue)

    // 4. Zeichnen im Container
    if (chartContainer) {
      tfvis.render.scatterplot(
        chartContainer.current,
        { 
          values: [actualPoints, predictedPoints], 
          // Wir nennen die Serien entsprechend
          series: ["Original", 'Predicted'] 
        },
        {
          xLabel: 'X-Werte',
          yLabel: 'Y-Werte',
          height: 400,
          zoomToFit: true,
        }
      );
    }

    // 5. Speicherbereinigung
    // WICHTIG: Wir löschen HIER nur 'predictions', da 'testXTensor' 
    // außerhalb der Funktion erstellt wurde und am Ende des useEffects gelöscht wird!
    predictions.dispose();
  }

  function cleanUp(){
    if (trainingChartClean.current) trainingChartClean.current.innerHTML = "";
    if (trainingChartBest.current) trainingChartBest.current.innerHTML = "";
    if (trainingChartOverfit.current) trainingChartOverfit.current.innerHTML = "";
    setLearningDone(false)
    setTrainedModels({
      clean: null,
      best: null,
      overfit: null
    })
  }

  // --- DAS RETURN DESIGN ---
  return (
    <div className='flex flex-col gap-8'>
      
      <div className='flex flex-col gap-4'>

      
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl font-semibold text-foreground'>Datensätze und Modelle trainieren</h2>
        <div className='flex gap-2'>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="dataPoints">Datenpaare (N)</Label>
              <Input 
                type="number"
                step={10}
                min={10} 
                id="datapoints" 
                placeholder="100" 
                value={dataPoints}
                onChange={(e) => setDataPoints(e.target.value)}
                onBlur={() => {
                  // Wird erst ausgeführt, wenn das Feld den Fokus verliert
                  let val = parseInt(dataPoints, 10);
                  if (!isNaN(val) && val % 2 !== 0) {
                    setDataPoints(val + 1);
                  }

                  if (val < 10) {
                    setDataPoints(10);
                  }
                }}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Label htmlFor="batchsize">Batchsize</Label>
              <Input 
                type="number"
                step={1}
                min={1} 
                id="batchsize" 
                placeholder="32" 
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                onBlur={() => {
                  // Wird erst ausgeführt, wenn das Feld den Fokus verliert
                  let val = parseInt(batchSize);
                  if (val < 0) {
                    setBatchSize(1);
                  }
                }}
              />
            </div>

          </div>

          <div className='flex gap-2'>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="groundTruth">Epochen Ground Truth Modell</Label>
              <Input 
                type="number"
                step={10}
                min={10} 
                id="groundTruth" 
                placeholder="100" 
                value={epoches.groundTruth}
                onChange={(e) => setEpoches({...epoches, groundTruth: e.target.value})}
                onBlur={() => {
                  // Wird erst ausgeführt, wenn das Feld den Fokus verliert
                  let val = parseInt(epoches.groundTruth);
                 
                  if (val < 10) {
                    setEpoches({...epoches, groundTruth: 10})
                  }
                }}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Label htmlFor="bestfit">Epochen Bestfit Modell</Label>
              <Input 
                type="number"
                step={10}
                min={10} 
                id="bestfit" 
                placeholder="100" 
                value={epoches.bestfit}
                onChange={(e) => setEpoches({...epoches, bestfit: e.target.value})}
                onBlur={() => {
                  // Wird erst ausgeführt, wenn das Feld den Fokus verliert
                  let val = parseInt(epoches.bestfit);
                 
                  if (val < 10) {
                    setEpoches({...epoches, bestfit: 10})
                  }
                }}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Label htmlFor="overfit">Epochen Overfit Modell</Label>
              <Input 
                type="number"
                step={10}
                min={10} 
                id="overfit" 
                placeholder="100" 
                value={epoches.overfit}
                onChange={(e) => setEpoches({...epoches, overfit: e.target.value})}
                onBlur={() => {
                  // Wird erst ausgeführt, wenn das Feld den Fokus verliert
                  let val = parseInt(epoches.overfit);
                 
                  if (val < 10) {
                    setEpoches({...epoches, overfit: 10})
                  }
                }}
              />
            </div>

                
          </div>
          <Button className="w-fit" onClick={()=>{
            cleanUp();
            runApp();
          }}
          disabled={learningRunning}
          >
            Training starten
          </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 grid-auto-rows-fr gap-6 w-full max-w-full overflow-hidden">
          <div className={`flex flex-col gap-2 min-w-0 w-full h-full ${!initialLearning ? 'opacity-0' : ''}`}>
            <h3 className="text-lg font-semibold">Generierte Datensätze unverrauscht</h3>
            <div 
              ref={groundTruthRef} 
              className="border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col justify-between [&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
            >
              {/* Das Canvas wird hier hineingezogen */}
            </div>
          </div>
          
          <div className={`flex flex-col gap-2 min-w-0 w-full h-full ${!initialLearning ? 'opacity-0' : ''}`}>
            <h3 className="text-lg font-semibold">Generierte Datensätze verrauscht</h3>
            <div 
              ref={noisyDataRef} 
              className="border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col justify-between [&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
            >
              {/* Das Canvas wird hier hineingezogen */}
            </div>
          </div>

          <div className={`flex flex-col gap-2 min-w-0 w-full h-full ${!initialLearning ? 'hidden' : ''}`}>
            <h3 className="text-lg font-semibold">Ground Truth Modell</h3>
            <div 
              ref={trainingChartClean} 
              className="border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col justify-between [&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
            >
              {/* Hier wird das Live-Canvas hineingezogen */}
            </div>
          </div>
        
        <div className={`flex flex-col gap-2 min-w-0 w-full h-full ${!trainedModels.clean ? 'hidden' : ''}`}>
          <h3 className="text-lg font-semibold">Best-Fit Modell</h3>
          <div 
            ref={trainingChartBest} 
            className="border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col justify-between [&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
          >
            {/* Hier wird das Live-Canvas hineingezogen */}
          </div>
        </div>
        
        <div className={`flex flex-col gap-2 min-w-0 w-full h-full ${!trainedModels.best ? 'hidden' : ''}`}>
          <h3 className="text-lg font-semibold">Overfit Modell</h3>
          <div 
            ref={trainingChartOverfit} 
            className="border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col justify-between [&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
          >
            {/* Hier wird das Live-Canvas hineingezogen */}
          </div>
        </div>

      </div>
      </div>
      
      {/* grid-auto-rows-fr erzwingt, dass alle Zeilen/Reihen die Höhe des größten Elements annehmen */}
       
      <div className={`flex flex-col gap-4 ${!learningDone ? 'hidden' : ''}`}>
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl font-semibold text-foreground'>Vorhersagen</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 grid-auto-rows-fr gap-6 w-full max-w-full overflow-hidden">
                
          <div className="flex flex-col gap-2 min-w-0 w-full h-full">
            <h3 className="text-lg font-semibold">Ground Truth Model (Trainingsdaten)</h3>
            <div className='border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col gap-4 justify-between '>
              <div 
                ref={GroundTruthPredictTrainRef} 
                className="[&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
              >
                {/* Hier wird das Live-Canvas hineingezogen */}
              </div>
              <div>
                Mean Square Error (MSE): {groundTruthPredictTrainMse ? groundTruthPredictTrainMse.toFixed(3) : ""}
              </div>
              
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0 w-full h-full">
            <h3 className="text-lg font-semibold">Ground Truth Model (Testdaten)</h3>
            <div className='border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col gap-4 justify-between '>
              <div 
                ref={GroundTruthPredictTestRef} 
                className="[&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
              >
                {/* Hier wird das Live-Canvas hineingezogen */}
              </div>
              <div>
                Mean Square Error (MSE): {groundTruthPredictTestMse ? groundTruthPredictTestMse.toFixed(3) : ""}
              </div>
              
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0 w-full h-full">
            <h3 className="text-lg font-semibold">Best-Fit Modell Trainingsdaten</h3>
            <div className='border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col gap-4 justify-between '>
              <div 
                ref={BestfitPredictTrainRef} 
                className="[&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
              >
                {/* Hier wird das Live-Canvas hineingezogen */}
              </div>
              <div>
                Mean Square Error (MSE): {bestfitPredictTrainMse ? bestfitPredictTrainMse.toFixed(3) : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0 w-full h-full">
            <h3 className="text-lg font-semibold">Best-Fit Modell Testdaten</h3>
            <div className='border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col gap-4 justify-between '>
              <div 
                ref={BestfitPredictTestRef} 
                className="[&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
              >
                {/* Hier wird das Live-Canvas hineingezogen */}
              </div>
              <div>
                Mean Square Error (MSE): {bestfitPredictTestMse ? bestfitPredictTestMse.toFixed(3) : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0 w-full h-full">
            <h3 className="text-lg font-semibold">Overfit Modell Trainingsdaten</h3>
            <div className='border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col gap-4 justify-between '>
              <div 
                ref={OverfitPredictTrainRef} 
                className="[&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
              >
                {/* Hier wird das Live-Canvas hineingezogen */}
              </div>
              <div>
                Mean Square Error (MSE): {overfitPredictTrainMse ? overfitPredictTrainMse.toFixed(3) : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0 w-full h-full">
            <h3 className="text-lg font-semibold">Overfit Modell Testdaten</h3>
            <div className='border p-4 rounded-lg bg-white shadow-sm w-full h-full overflow-hidden flex flex-col gap-4 justify-between '>
              <div 
                ref={OverfitPredictTestRef} 
                className="[&_canvas]:!w-full [&_canvas]:!h-auto [&_svg]:!w-full [&_svg]:!h-auto"
              >
                {/* Hier wird das Live-Canvas hineingezogen */}
              </div>
              <div>
                Mean Square Error (MSE): {overfitPredictTestMse ? overfitPredictTestMse.toFixed(3) : ""}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}