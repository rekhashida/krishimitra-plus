import { useState, useRef } from 'react'
import { Camera, Upload, Leaf, Volume2 } from 'lucide-react'
import { Client } from '@gradio/client'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { tCrop } from '../i18n/translations'
import { getDiseaseInfo } from '../data/diseaseDatabase'

const HF_SPACE = 'rekhashida/krishimitra-disease-api'

export default function CropScanner() {
  const { userProfile, t, language } = useApp()
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const sevLabel = (s) => {
    if (s === 'High') return t('sevHigh')
    if (s === 'Moderate') return t('sevModerate')
    if (s === 'None') return t('sevLow')
    return t('sevLow')
  }

  const handleFile = (file) => {
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
    setResult(null)
    setError('')
  }

  const runScan = async () => {
    if (!imageFile) { setError(t('noCropPhoto')); return }
    setScanning(true)
    setError('')

    try {
      // Connect to Hugging Face Space
      const client = await Client.connect(HF_SPACE)

      // Send image to AI model
      const apiResult = await client.predict('/predict_disease', {
        img: imageFile,
      })

      // apiResult.data is the dict returned by our app.py:
      // { disease, confidence, top3 }
      const data = apiResult.data[0] // Gradio wraps output in an array

      const diseaseName = data.disease
      const confidence = data.confidence

      // Look up remedy info
      const info = getDiseaseInfo(diseaseName)

      const scanResult = {
        crop: info.crop,
        disease: diseaseName,
        confidence: confidence,
        severity: info.severity,
        cause: info.cause,
        organic: info.organic,
        chemical: info.chemical,
        prevention: info.prevention,
        advice: info.organic, // for backward compatibility with severity tags
      }

      setResult(scanResult)

      // Save to Supabase if configured
      if (isSupabaseConfigured() && userProfile?.id) {
        await supabase.from('crop_scans').insert([{
          farmer_id: userProfile.id,
          crop_name: scanResult.crop,
          disease: scanResult.disease,
          severity: scanResult.severity,
          recommendation: scanResult.organic,
        }])
      }
    } catch (err) {
      console.error('Scan error:', err)
      setError('Could not reach AI model. Please check your internet connection and try again.')
    }

    setScanning(false)
  }

  const speakResult = () => {
    if (!result) return
    const text = `${result.disease}. ${t('cropLabel')} ${tCrop(language, result.crop)}. ${t('recommendation')}: ${result.organic}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const severityClass = (s) => {
    if (s === 'High') return 'tag-danger'
    if (s === 'Moderate') return 'tag-warning'
    return 'tag'
  }

  return (
    <div>
      <h1 className="page-title">{t('cropScannerTitle')}</h1>
      <p className="page-subtitle">{t('cropScannerSub')}</p>
      <div className="scanner-area">
        {preview ? (
          <img src={preview} alt="" style={{ maxHeight: 200, margin: '0 auto 12px', borderRadius: 8 }} />
        ) : (
          <>
            <Camera size={48} />
            <p style={{ color: 'var(--paddy-green)', fontWeight: 600 }}>{t('capturePrompt')}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{t('formatHint')}</p>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
      <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
        <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
          <Upload size={18} />{preview ? t('changePhoto') : t('uploadCapture')}
        </button>
        <button type="button" className="btn btn-primary" onClick={runScan} disabled={scanning}>
          <Leaf size={18} />{scanning ? t('analyzing') : t('scanForDisease')}
        </button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className={`card ${result.severity === 'High' ? 'card-error' : result.severity === 'Moderate' ? 'card-warning' : 'card-green'}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ marginBottom: 8, color: 'var(--dark-loam)' }}>{t('scanResults')}</h3>
            <button type="button" className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={speakResult} title="Speak result">
              <Volume2 size={16} />
            </button>
          </div>
          <p><strong>{t('cropLabel')}</strong> {tCrop(language, result.crop)}</p>
          <p><strong>{t('detected')}</strong> {result.disease}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confidence: {result.confidence}%</p>
          <p style={{ marginTop: 8 }}><strong>{t('severity')}</strong> <span className={`tag ${severityClass(result.severity)}`}>{sevLabel(result.severity)}</span></p>

          <div className="alert alert-success" style={{ marginTop: 12 }}>
            <strong>Organic Remedy:</strong> {result.organic}
          </div>
          <div className="alert alert-warning" style={{ marginTop: 8 }}>
            <strong>Chemical Remedy:</strong> {result.chemical}
          </div>
          <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
            <strong>Cause:</strong> {result.cause}
          </div>
          <div style={{ marginTop: 4, fontSize: '0.85rem' }}>
            <strong>Prevention:</strong> {result.prevention}
          </div>
        </div>
      )}
      <div className="card" style={{ marginTop: 16 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          AI-powered crop disease detection — works best with clear close-up photos of leaves.
        </p>
      </div>
    </div>
  )
}