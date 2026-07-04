import { Button } from '@/components/ui/button'
import { UploadSimple } from '@phosphor-icons/react'
import { useState, useRef, useEffect } from 'react'
import { Separator } from "@/components/ui/separator"
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// WICHTIG: Plugin registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

import { CircleNotch } from "@phosphor-icons/react"

export function Classification() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(null)
  const [userImages, setUserImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    console.log(results)
  }, [results])

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setUserImages(prev => [...prev, { id: `user-upload-${userImages.length}`, url, label: `User Upload ${userImages.length + 1}` }])
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const classifyImage = async (imgId) => {
    if (!window.ml5) return;

    setLoading(imgId)
    const classifier = await window.ml5.imageClassifier('MobileNet')
    const img = document.getElementById(imgId)

    classifier.classify(img, (err, results) => {
      if (err) {
        console.error(err)
      } else {
        setResults(prev => ({ ...prev, [imgId]: results }))
      }
      setLoading(null)
    })
  }

  const images = [
    { id: 'img1', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Tiger_shark.jpg/1920px-Tiger_shark.jpg', label: 'Tigerhai' },
    { id: 'img2', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Labrador_Farbe_charcoal.jpg', label: 'Labrador Retriever' },
    { id: 'img3', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/15-07-12-Ciclistas-en-Mexico-RalfR-N3S_8973.jpg/3840px-15-07-12-Ciclistas-en-Mexico-RalfR-N3S_8973.jpg', label: 'Fahrrad' },
    { id: 'img4', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Carcharodon_carcharias.jpg/1920px-Carcharodon_carcharias.jpg', label: 'Weißer Hai' },
    { id: 'img5', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Labrador_Retriever_Chocolate_Brown_Portrait_-_Sam.jpg', label: 'Labrador Retriever' },
    { id: 'img6', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', label: 'Pizza' },
  ]

  const barChart = (results) => {
    const chartData = {
      labels: results.map(r => r.label),
      datasets: [{
        label: 'Konfidenz',
        data: results.map(r => r.confidence * 100),
        backgroundColor: 'rgba(75, 192, 192, 0.4)', // Etwas kräftiger für bessere Lesbarkeit
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    };

    const chartOptions = {
      responsive: true,
      indexAxis: 'y', // Horizontale Balken
      plugins: {
        legend: {
          display: false, // Optional: Legende ausblenden, wenn Labels im Balken stehen
        },
        datalabels: {
          display: true,
          color: '#000', // Schriftfarbe (Schwarz)
          anchor: 'start', // Startet am Anfang des Balkens (links)
          align: 'right',  // Schreibt den Text nach rechts (in den Balken hinein)
          offset: 10,      // Kleiner Abstand vom linken Rand
          formatter: (value, context) => {
            // Zeigt das Label UND den Wert an (z.B. "Red: 12")
            const label = context.chart.data.labels[context.dataIndex].split(",")[0];
            return `${label}: ${value.toFixed(2)}%`;
          },
          font: {
            weight: 'bold',
            size: 12
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            display: false // Optional: Versteckt die Labels an der Achse, da sie nun im Balken stehen
          },
          grid: {
            display: false
          }
        }
      }
    };

    return <Bar data={chartData} options={chartOptions} />;
  };

  const borderStyling = (img, i) => {
    if (results[img.id] && i < 3) {
      return `border-green-700`;
    } else if (results[img.id] && i >= 3) {
      return `border-red-700`;
    }
    return `border-transparent`;
  }

  const TagStyling = (img, i) => {
    if (results[img.id] && i < 3) {
      return `bg-green-100/80 text-green-700`;
    } else if (results[img.id] && i >= 3) {
      return `bg-red-100/80 text-red-700`;
    }
    return `border-transparent`;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 flex-1">
        <h2 className="text-3xl font-bold tracking-tight">Image Classifier Beispiele</h2>
        <p className="text-text-subinfo max-w-2xl">
          Klassifizierung von Bildern mit ml5.js und dem MobileNet Modell. Die ersten drei werden korrekt klassifizeirt, die nachfolgenden nicht.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {images.map((img, i) => (
          <div key={img.id} className="flex gap-6 items-stretch">
            <div className="flex-1 basis-1/2 min-w-0 aspect-video overflow-hidden relative">
              <img
                id={img.id}
                src={img.url}
                alt={img.label}
                crossOrigin="anonymous"
                className={`object-cover w-full h-full rounded-xl border-2 ${borderStyling(img, i)}`}
              />
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-sm font-medium uppercase whitespace-nowrap tracking-wider ${TagStyling(img, i)}`}>
                {results[img.id] ? (i < 3 ? 'Korrekt' : 'Falsch') : ''}
              </div>
            </div>

            <Separator orientation="vertical" className="h-auto" />

            <div className="flex-1 basis-1/2 min-w-0 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{img.label}</span>
              </div>

              {results[img.id] ?
                barChart(results[img.id])
                : (
                  <div className="flex flex-1 relative w-full justify-center items-center bg-bg-alternation rounded-xl">
                    <Button
                      onClick={() => classifyImage(img.id)}
                      disabled={loading}
                      className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity w-28"
                    >
                      {loading == img.id ? <CircleNotch className="animate-spin" /> : 'Klassifizieren'}
                    </Button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-1 mt-12">
        <h2 className="text-3xl font-bold tracking-tight">Image Classifier eigener Upload</h2>
        <p className="text-text-subinfo max-w-2xl">
          Lade hier ein eigenes Bild hoch oder ziehe es per Drag-and-Drop rein.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {userImages.map((img, i) => (
          <div key={img.id} className="flex gap-6 items-stretch">
            <div className="flex-1 basis-1/2 min-w-0 aspect-video overflow-hidden relative">
              <img
                id={img.id}
                src={img.url}
                alt={img.label}
                crossOrigin="anonymous"
                className={`object-cover w-full h-full rounded-xl border-2 border-transparent`}
              />
            </div>

            <Separator orientation="vertical" className="h-auto" />

            <div className="flex-1 basis-1/2 min-w-0 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{img.label}</span>
              </div>

              {results[img.id] ?
                barChart(results[img.id])
                : (
                  <div className="flex flex-1 relative w-full justify-center items-center bg-bg-alternation rounded-xl">
                    <Button
                      onClick={() => classifyImage(img.id)}
                      disabled={loading}
                      className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity w-28"
                    >
                      {loading == img.id ? <CircleNotch className="animate-spin" /> : 'Klassifizieren'}
                    </Button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center gap-4 transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <>
          <UploadSimple size={48} className="text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-lg font-medium">Bild auswählen oder ablegen</p>
            <p className="text-sm text-text-subinfo">JPG, PNG oder WebP bis zu 5MB</p>
          </div>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Datei auswählen</Button>
        </>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
      </div>
    </div>
  )
}
