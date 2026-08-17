// Derives site logo assets from the canonical artwork in src/assets/logo.png:
//   src/assets/logo-lucka.png – just the lucka, keyed transparent; the full burst
//                               is illegible at header/footer sizes so the compact
//                               lockup is lucka + text wordmark
//   public/favicon.png        – square mark crop on brand background, 512 px
//   public/apple-touch-icon.png – same crop, 180 px
// Run from the repo root: node scripts/derive-logo-assets.mjs
import sharp from 'sharp'

const SOURCE = 'src/assets/logo.png'
const BG = { r: 1, g: 23, b: 31 }
// Alpha ramp: fully transparent below NEAR, fully opaque above FAR (Euclidean RGB distance)
const NEAR = 30
const FAR = 90
const LUCKA_CROP = { left: 448, top: 742, width: 340, height: 176 }
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
    const opacity = Math.min(Math.max((distance - NEAR) / (FAR - NEAR), 0), 1)
    data[i + 3] = Math.round(opacity * 255)
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(file)
}

async function writeIcon(size, file) {
  await sharp(SOURCE).extract(ICON_CROP).resize(size, size).png().toFile(file)
}

await writeKeyedCrop(LUCKA_CROP, 300, 'src/assets/logo-lucka.png')
await writeIcon(512, 'public/favicon.png')
await writeIcon(180, 'public/apple-touch-icon.png')
console.log('Logo assets written.')
