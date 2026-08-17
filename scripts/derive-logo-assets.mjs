// Derives site logo assets from the canonical artwork in src/assets/logo.png:
//   src/assets/logo-mark.png  – the full burst mark (rays, snacks, lucka) minus
//                               the baked-in wordmark, keyed transparent; used
//                               in header/footer next to a text wordmark
//   public/favicon.png        – square mark crop on brand background, 512 px
//   public/apple-touch-icon.png – same crop, 180 px
// Run from the repo root: node scripts/derive-logo-assets.mjs
import sharp from 'sharp'

const SOURCE = 'src/assets/logo.png'
const BG = { r: 1, g: 23, b: 31 }
// Alpha ramp: fully transparent below NEAR, fully opaque above FAR (Euclidean RGB distance)
const NEAR = 30
const FAR = 90
const MARK_CROP = { left: 66, top: 128, width: 1106, height: 786 }
const ICON_CROP = { left: 173, top: 35, width: 890, height: 890 }

async function writeKeyedCrop(crop, width, file) {
  const { data, info } = await sharp(SOURCE)
    .extract(crop)
    .resize({ width })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += info.channels) {
    const distance = Math.hypot(data[i] - BG.r, data[i + 1] - BG.g, data[i + 2] - BG.b)
    const alpha = Math.min(Math.max((distance - NEAR) / (FAR - NEAR), 0), 1)
    data[i + 3] = Math.round(alpha * 255)
    if (alpha > 0 && alpha < 1) {
      // Edge pixels are foreground mixed with BG: unmix so they don't render
      // as dark halos when composited on a background other than BG
      data[i] = Math.min(255, Math.max(0, Math.round((data[i] - BG.r * (1 - alpha)) / alpha)))
      data[i + 1] = Math.min(255, Math.max(0, Math.round((data[i + 1] - BG.g * (1 - alpha)) / alpha)))
      data[i + 2] = Math.min(255, Math.max(0, Math.round((data[i + 2] - BG.b * (1 - alpha)) / alpha)))
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(file)
}

async function writeIcon(size, file) {
  await sharp(SOURCE).extract(ICON_CROP).resize(size, size).png().toFile(file)
}

await writeKeyedCrop(MARK_CROP, 480, 'src/assets/logo-mark.png')
await writeIcon(512, 'public/favicon.png')
await writeIcon(180, 'public/apple-touch-icon.png')
console.log('Logo assets written.')
