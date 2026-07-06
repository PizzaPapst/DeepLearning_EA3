import React, { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  WarningCircle
} from "@phosphor-icons/react"

export function LanguageModel() {
  // Model & Vocab Loading State
  const [vocab, setVocab] = useState(null)
  const [model, setModel] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState("Warte auf Initialisierung...")
  const [modelReady, setModelReady] = useState(false)
  const [selectedModelPath, setSelectedModelPath] = useState("model")

  // Interactive States
  const [inputText, setInputText] = useState("So vielgestaltig aber auch die")
  const [predictions, setPredictions] = useState([])
  const [warning, setWarning] = useState("")
  const [isAuto, setIsAuto] = useState(false)
  const [autoSteps, setAutoSteps] = useState(0)
  const [backendName, setBackendName] = useState("")

  // Load Model and Vocabulary on mount or model change
  useEffect(() => {
    async function loadModelAndVocab() {
      try {
        setModelReady(false)
        setLoadingStatus("TFJS wird vorbereitet...")
        await tf.ready()
        setBackendName(tf.getBackend())

        setLoadingStatus("Lade Vokabular (vocab.json)...")
        const vocabRes = await fetch("/vocab.json")
        if (!vocabRes.ok) {
          throw new Error("vocab.json konnte nicht geladen werden.")
        }
        const vocabData = await vocabRes.json()
        setVocab(vocabData)

        setLoadingStatus(`Lade Modell (${selectedModelPath})...`)
        const loadedModel = await tf.loadLayersModel(`/${selectedModelPath}/model.json`)
        setModel(loadedModel)
        setModelReady(true)
        setLoadingStatus("Bereit")
      } catch (err) {
        console.error("Fehler beim Laden von Vokabular oder Modell:", err)
        setLoadingStatus(`Fehler beim Laden: ${err.message}`)
      }
    }
    loadModelAndVocab()
  }, [selectedModelPath])

  // Helper function to clean and split input text into words
  const getCleanTokens = (text) => {
    if (!text) return []
    return text
      .split(/\s+/)
      .map(w => w.toLowerCase().replace(/[!?,.:;()"'-\[\]]/g, ""))
      .filter(w => w !== "")
  }

  // Prediction Logic
  const predict = async (textToPredict = inputText) => {
    if (!model || !vocab) return

    const tokens = getCleanTokens(textToPredict)
    if (tokens.length < 5) {
      setWarning(`Bitte geben Sie mindestens 5 Wörter ein (aktuell: ${tokens.length}).`)
      setPredictions([])
      return
    }
    setWarning("")

    const last5Tokens = tokens.slice(-5)
    // Map words to indices, fallback to 0 for out-of-vocabulary words
    const encoded = last5Tokens.map(w => vocab.wordIndex[w] || 0)

    try {
      const probs = tf.tidy(() => {
        const inputTensor = tf.tensor2d([encoded], [1, 5], 'int32')
        const pred = model.predict(inputTensor)
        return pred.dataSync()
      })

      const wordProbs = []
      for (let i = 0; i < probs.length; i++) {
        wordProbs.push({ id: i, probability: probs[i] })
      }
      wordProbs.sort((a, b) => b.probability - a.probability)

      const top5 = wordProbs.slice(0, 5).map(item => {
        const word = vocab.indexWord[item.id] || "???"
        return {
          word,
          probability: item.probability
        }
      })

      setPredictions(top5)
    } catch (e) {
      console.error("Prediction error:", e)
      setWarning("Fehler bei der Vorhersage.")
    }
  }

  // Keine automatische Vorhersage beim Laden

  // Recursive-like useEffect to handle the auto generation pace securely
  useEffect(() => {
    if (isAuto && predictions.length > 0 && autoSteps < 10) {
      const timer = setTimeout(() => {
        const nextWord = predictions[0].word
        const newText = inputText.trim() + " " + nextWord
        setInputText(newText)
        setAutoSteps(prev => prev + 1)
        predict(newText)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (autoSteps >= 10) {
      setIsAuto(false)
      setAutoSteps(0)
    }
  }, [isAuto, predictions, autoSteps])

  const handleChoose = (word) => {
    if (isAuto) stopAuto()
    const newText = inputText.trim() + " " + word
    setInputText(newText)
    predict(newText)
  }

  const handleNext = () => {
    if (predictions.length > 0) {
      handleChoose(predictions[0].word)
      setPredictions([])
    }
  }

  const startAuto = () => {
    if (predictions.length === 0) return
    setIsAuto(true)
    setAutoSteps(0)
  }

  const stopAuto = () => {
    setIsAuto(false)
    setAutoSteps(0)
  }

  const handleReset = () => {
    stopAuto()
    const defaultText = "So vielgestaltig aber auch die"
    setInputText(defaultText)
    setWarning("")
    setPredictions([])
  }

  // Word and character stats
  const currentTokens = getCleanTokens(inputText)
  const wordCount = currentTokens.length

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Title & Header Section */}
      <div className="w-full max-w-[650px] flex flex-col gap-2">

        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          LSTM Sprachmodell
        </h2>
        <p className="text-text-subinfo max-w-2xl">Verwenden Sie die Buttons über dem Eingabefeld, um die nächsten Wörter basierend auf Ihrem Text vorherzusagen. Sie können auch automatisch Wörter generieren lassen, um den Text zu vervollständigen.</p>
      </div>

      <div className="w-full max-w-[650px] flex flex-col gap-8">

        {/* Left Column */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => predict(inputText)}
              disabled={!modelReady || wordCount < 5 || isAuto}
              variant="default"
              className="flex items-center gap-2"
            >
              Vorhersagen
            </Button>

            <Button
              onClick={handleNext}
              disabled={!modelReady || predictions.length === 0 || isAuto}
              variant="secondary"
              className="flex items-center gap-2"
            >
              Weiter
            </Button>

            {isAuto ? (
              <Button
                onClick={stopAuto}
                variant="destructive"
                className="flex items-center gap-2 animate-pulse"
              >
                Stop ({10 - autoSteps})
              </Button>
            ) : (
              <Button
                onClick={startAuto}
                disabled={!modelReady || predictions.length === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                Auto-Generieren
              </Button>
            )}

            <div className='flex-1 flex justify-end'>
              <Button
                onClick={handleReset}
                variant="ghost"
                className="flex items-center gap-2"
              >
                Reset
              </Button>
            </div>
          </div>

          <textarea
            id="prompt-input"
            rows={5}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              setPredictions([]) // Alte Kandidaten leeren bei Eingabe
            }}
            className="w-full rounded-lg border border-input bg-bg-default px-4 py-3 text-base text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/50 "
            placeholder="Geben Sie hier Ihren deutschen Text ein..."
          />




        </div>

        {/* Right Side: Prediction Bars */}
        <div className="max-w-[650px] rounded-xl flex flex-col gap-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center">
            Nächste Wort-Kandidaten
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-3">
            {predictions.length > 0 ? (
              predictions.map((p, idx) => {
                const percentage = p.probability * 100
                return (
                  <div
                    key={p.word + idx}
                    className="relative w-full overflow-hidden rounded-xl border border-border bg-bg-default p-4 text-left shadow-sm transition-all duration-300"
                  >
                    {/* Probability filling background */}
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/5"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        {p.word}
                      </span>
                      <span className="font-mono text-sm font-bold text-primary">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>

                    {/* Small progress bar line at the very bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary">
                      <div
                        className="h-full bg-primary/50"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl flex-1 min-h-[300px]">
                <WarningCircle size={40} className="text-text-subinfo" />
                <span className="text-sm font-semibold text-foreground">
                  Keine Vorhersagen verfügbar
                </span>
                <span className="text-xs text-text-subinfo mt-1 max-w-[200px]">
                  {modelReady
                    ? "Bitte tippen Sie mindestens 5 Wörter ein, um Vorhersagen anzuzeigen."
                    : "Modell wird geladen. Bitte warten..."}
                </span>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}
