import { m as motion } from 'motion/react'
import { tick } from '../sound.js'

// Tek bir kamera ayarı kartı (büyük, dokunmatik dostu kaydırıcı).
// Her kademe değişiminde tık sesi + değer "zıplar".
export default function Control({ icon, title, sub, value, max, index, onChange, leftLabel, rightLabel, hint }) {
  return (
    <div className="control">
      <div className="control-head">
        <span className="control-icon">{icon}</span>
        <div className="control-title">
          <strong>{title}</strong>
          <small>{sub}</small>
        </div>
        <motion.span
          key={value}
          className="control-value"
          initial={{ scale: 1.35, y: -4 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 18 }}
        >
          {value}
        </motion.span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={index}
        aria-label={title}
        style={{ '--fill': `${(index / max) * 100}%` }}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (v !== index) tick()
          onChange(v)
        }}
      />
      <div className="range-labels">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {hint && (
        <motion.p key={hint} className="hint" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
          {hint}
        </motion.p>
      )}
    </div>
  )
}
