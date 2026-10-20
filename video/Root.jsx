import { Composition } from 'remotion'
import { Promo, PROMO_FRAMES } from './Promo.jsx'

// Play Store tanıtım videosu: 30 sn, 1920×1080, Türkçe ve İngilizce.
export function RemotionRoot() {
  return (
    <>
      <Composition id="PromoTR" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ lang: 'tr' }} />
      <Composition id="PromoEN" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ lang: 'en' }} />
    </>
  )
}
