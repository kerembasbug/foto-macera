// Tek bir kamera ayarı kartı (büyük, dokunmatik dostu kaydırıcı).
export default function Control({ icon, title, sub, value, max, index, onChange, leftLabel, rightLabel, hint }) {
  return (
    <div className="control">
      <div className="control-head">
        <span className="control-icon">{icon}</span>
        <div className="control-title">
          <strong>{title}</strong>
          <small>{sub}</small>
        </div>
        <span className="control-value">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="range-labels">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  )
}
