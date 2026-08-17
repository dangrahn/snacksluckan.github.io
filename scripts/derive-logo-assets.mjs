// Derives site logo assets from the canonical artwork in src/assets/logo.png:
//   src/assets/logo-mark.png  – burst + lucka only, background keyed to transparent
//   public/favicon.png        – square mark crop on brand background, 512 px
//   public/apple-touch-icon.png – same crop, 180 px
// Run from the repo root: node scripts/derive-logo-assets.mjs
import sharp from 'sharp'

const SOURCE = 'src/assets/logo.png'
const BG = { r: 14, g: 34, b: 33 }
// Alpha ramp: fully transparent below NEAR, fully opaque above FAR (Euclidean RGB distance)
const NEAR = 30
const FAR = 90
const MARK_CROP = { left: 40, top: 60, width: 1174, height: 890 }
const ICON_CROP = { left: 157, top: 0, width: 940, height: 940 }

async function writeMark() {
  const { data, info } = await sharp(SOURCE)
    .extract(MARK_CROP)
    .resize({ width: 800 })
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
    .toFile('src/assets/logo-mark.png')
}

async function writeIcon(size, file) {
  await sharp(SOURCE).extract(ICON_CROP).resize(size, size).png().toFile(file)
}

await writeMark()
await writeIcon(512, 'public/favicon.png')
await writeIcon(180, 'public/apple-touch-icon.png')
console.log('Logo assets written.')
