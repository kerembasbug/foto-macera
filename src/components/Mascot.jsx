// "Çıt" — oyunun rehber maskotu (Gemini ile üretilen görsel).
export default function Mascot({ size = 56 }) {
  return (
    <img
      src="/art/mascot.png"
      width={size}
      height={size}
      className="mascot"
      alt="Çıt, fotoğraf makinesi maskotu"
      draggable="false"
    />
  )
}
