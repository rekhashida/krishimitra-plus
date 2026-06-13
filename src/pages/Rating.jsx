import { useState } from 'react'
import { Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const DEMO_REVIEWS = [
  { name: 'Ramesh Patel', rating: 5, comment: 'Excellent work during harvest season. Very reliable.', date: '2 days ago' },
  { name: 'Ganesh More', rating: 4, comment: 'Good pesticide spraying skills. Arrived on time.', date: '1 week ago' },
]

export default function Rating() {
  const { userProfile, userType, t } = useApp()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError(t('selectStars')); return }
    setError('')
    if (isSupabaseConfigured()) {
      await supabase.from('ratings').insert([{
        from_user_id: userProfile?.id, from_user_type: userType, rating, comment,
        created_at: new Date().toISOString(),
      }])
    }
    setSubmitted(true)
    setRating(0)
    setComment('')
  }

  return (
    <div>
      <h1 className="page-title">{t('ratingTitle')}</h1>
      <p className="page-subtitle">{t('ratingSub')}</p>
      <div className="card card-green">
        <h3 style={{ fontSize: '1rem', marginBottom: 8, color: 'var(--deep-soil)' }}>{t('yourRating')}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={24} fill={n <= 4 ? 'var(--harvest-sun)' : 'none'} color="var(--harvest-sun)" />
          ))}
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--dark-bark)' }}>4.0</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('reviews', { count: DEMO_REVIEWS.length })}</span>
        </div>
      </div>
      <h2 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--dark-loam)' }}>{t('recentReviews')}</h2>
      {DEMO_REVIEWS.map((review, i) => (
        <div key={i} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <strong style={{ color: 'var(--dark-loam)' }}>{review.name}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{review.date}</span>
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={14} fill={n <= review.rating ? 'var(--harvest-sun)' : 'none'} color="var(--harvest-sun)" />
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{review.comment}</p>
        </div>
      ))}
      <h2 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--dark-loam)' }}>
        {userType === 'farmer' ? t('rateWorker') : t('rateFarmer')}
      </h2>
      {submitted && <div className="alert alert-success">{t('ratingThanks')}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="card">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" className={`star-btn ${n <= (hover || rating) ? 'active' : ''}`}
              onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}>
              <Star size={32} fill={n <= (hover || rating) ? 'var(--harvest-sun)' : 'none'} />
            </button>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="comment">{t('commentOptional')}</label>
          <textarea id="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t('commentPlaceholder')} />
        </div>
        <button type="submit" className="btn btn-primary">{t('submitRating')}</button>
      </form>
    </div>
  )
}
