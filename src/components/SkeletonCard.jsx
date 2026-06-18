export default function SkeletonCard() {
  return (
    <div className="card km-skeleton-card">
      <div className="km-skeleton-line km-skeleton-w60" />
      <div className="km-skeleton-line km-skeleton-w40" style={{ marginTop: 10 }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <div className="km-skeleton-pill" />
        <div className="km-skeleton-pill" />
        <div className="km-skeleton-pill" />
      </div>
      <div className="km-skeleton-line km-skeleton-w30" style={{ marginTop: 14 }} />
    </div>
  )
}