const sharp = require('sharp');
const fs = require('fs');
const svg = fs.readFileSync('icons/icon.svg');
const maskable = Buffer.from(svg.toString().replace('rx="36"', 'rx="0"'));
async function run() {
  await sharp(svg).resize(192,192).png().toFile('icons/icon-192.png');               console.log('192 done');
  await sharp(svg).resize(512,512).png().toFile('icons/icon-512.png');               console.log('512 done');
  await sharp(maskable).resize(512,512).png().toFile('icons/icon-maskable-512.png'); console.log('maskable done');
  await sharp(svg).resize(180,180).png().toFile('icons/apple-touch-icon.png');       console.log('apple done');
}
run().catch(e => { console.error(e); process.exit(1); });
