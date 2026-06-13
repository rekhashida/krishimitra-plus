import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Languages } from 'lucide-react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import { LANGUAGES, translations } from '../i18n/translations'
import './LanguageSelect.css'

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { language, setLanguage, t } = useApp()
  const [selected, setSelected] = useState(language || 'en')

  const handleContinue = () => {
    setLanguage(selected)
    navigate('/')
  }

  const preview = LANGUAGES.find((l) => l.code === selected)
  const previewText = translations[selected] || translations.en

  return (
    <div className="language-select-page">
      <div className="language-hero">
        <Logo size="md" onDark={false} />
        <div className="language-icon-wrap">
          <Languages size={32} color="var(--forest-floor)" />
        </div>
      </div>

      <h1 className="page-title language-title">{previewText.chooseLanguage}</h1>
      <p className="page-subtitle language-subtitle">{previewText.chooseLanguageSub}</p>

      <div className="language-options">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`language-option ${selected === lang.code ? 'selected' : ''}`}
            onClick={() => setSelected(lang.code)}
          >
            <span className="language-flag">{lang.flag}</span>
            <div className="language-option-text">
              <span className="language-native">{lang.native}</span>
              <span className="language-label">{lang.native}</span>
            </div>
            {selected === lang.code && <span className="language-check">✓</span>}
          </button>
        ))}
      </div>

      <button type="button" className="btn btn-primary" onClick={handleContinue}>
        {previewText.continue}
      </button>

      <p className="language-footer">
        {preview?.native} • FROM FIELD TO FUTURE
      </p>
    </div>
  )
}
