import { useState, useMemo } from 'react'
import { X, ArrowLeftRight, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { LAND_UNITS, convertLand, formatLandValue, toAcres, QUICK_REFERENCE } from '../utils/landUnits'
import './FarmSizeCalculator.css'

export default function FarmSizeCalculator({ isOpen, onClose, onApplyAcres }) {
  const { t } = useApp()
  const [amount, setAmount] = useState('1')
  const [fromUnit, setFromUnit] = useState('bigha_up')
  const [toUnit, setToUnit] = useState('acre')

  const result = useMemo(() => formatLandValue(convertLand(amount, fromUnit, toUnit)), [amount, fromUnit, toUnit])
  const acresResult = useMemo(() => formatLandValue(toAcres(amount, fromUnit)), [amount, fromUnit])

  const swapUnits = () => { setFromUnit(toUnit); setToUnit(fromUnit) }

  const handleApply = () => {
    const acres = toAcres(amount, fromUnit)
    if (acres && acres > 0) { onApplyAcres(parseFloat(acres.toFixed(4))); onClose() }
  }

  if (!isOpen) return null

  const fromLabel = LAND_UNITS.find((u) => u.id === fromUnit)
  const toLabel = LAND_UNITS.find((u) => u.id === toUnit)

  return (
    <div className="calc-overlay" onClick={onClose} role="presentation">
      <div className="calc-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="calc-title" aria-modal="true">
        <div className="calc-header">
          <div>
            <h2 id="calc-title">{t('farmCalcTitle')}</h2>
          </div>
          <button type="button" className="calc-close" onClick={onClose} aria-label={t('close')}><X size={20} /></button>
        </div>
        <div className="calc-body">
          <div className="form-group">
            <label htmlFor="calc-amount">{t('enterValue')}</label>
            <input id="calc-amount" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="calc-unit-row">
            <div className="form-group">
              <label htmlFor="calc-from">{t('from')}</label>
              <select id="calc-from" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {LAND_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
              {fromLabel && <span className="calc-region">{fromLabel.region}</span>}
            </div>
            <button type="button" className="calc-swap-btn" onClick={swapUnits} aria-label={t('swapUnits')}><ArrowLeftRight size={18} /></button>
            <div className="form-group">
              <label htmlFor="calc-to">{t('to')}</label>
              <select id="calc-to" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                {LAND_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
              {toLabel && <span className="calc-region">{toLabel.region}</span>}
            </div>
          </div>
          <div className="calc-result-card">
            <p className="calc-result-label">{t('convertedResult')}</p>
            <p className="calc-result-value">{amount || '0'} {fromLabel?.label} = <strong>{result}</strong> {toLabel?.label}</p>
            <p className="calc-acres-hint">{t('acresHint', { acres: acresResult })}</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleApply}>
            <Check size={18} />{t('useAcresInForm', { acres: acresResult })}
          </button>
          <div className="calc-reference">
            <h3>{t('quickRef')}</h3>
            <div className="calc-ref-grid">
              {QUICK_REFERENCE.map((row) => (
                <div key={row.from} className="calc-ref-item"><span>{row.from}</span><span>=</span><span>{row.to}</span></div>
              ))}
            </div>
            <p className="calc-note">{t('bighaNote')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
