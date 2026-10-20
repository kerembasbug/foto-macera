import Mascot from '../components/Mascot.jsx'

// Sadece geliştirme: http://localhost:xxxx/#mascots — tüm duyguları yan yana gösterir.
const MOODS = ['idle', 'happy', 'cheer', 'wow', 'sad', 'think']
export default function MascotSheet() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: 32 }}>
      {MOODS.map((m) => (
        <div key={m} style={{ textAlign: 'center' }}>
          <Mascot size={110} mood={m} />
          <div style={{ marginTop: 8, fontWeight: 800 }}>{m}</div>
        </div>
      ))}
    </div>
  )
}
