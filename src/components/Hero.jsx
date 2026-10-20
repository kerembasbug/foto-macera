export default function Hero() {
  return (
    <div className="hero" aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}hero-bg.webp`} className="hero-img" alt="" draggable="false" />
    </div>
  )
}
