import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const inputPath = 'C:\\Users\\EP-0122\\.gemini\\antigravity-ide\\scratch\\early-years-platform\\logo\\photo_9_2026-09-09_08-36-48.jpg';
const outputDir = path.resolve('./public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Copy original file as logo.jpg
fs.copyFileSync(inputPath, path.join(outputDir, 'logo.jpg'));

// 2. Decode JPEG
const jpegData = fs.readFileSync(inputPath);
const rawImageData = jpeg.decode(jpegData, { useTArray: true });
const { width, height, data } = rawImageData;

// 3. Create transparent PNG
const png = new PNG({ width, height });

// Simple flood/threshold: any pixel where R, G, B < 25 is outer black background
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  if (r < 22 && g < 22 && b < 22) {
    // Outer black -> transparent
    png.data[i] = 0;
    png.data[i + 1] = 0;
    png.data[i + 2] = 0;
    png.data[i + 3] = 0;
  } else {
    png.data[i] = r;
    png.data[i + 1] = g;
    png.data[i + 2] = b;
    png.data[i + 3] = 255;
  }
}

const pngBuffer = PNG.sync.write(png);
fs.writeFileSync(path.join(outputDir, 'logo.png'), pngBuffer);

console.log(`Logo processed successfully! Width: ${width}, Height: ${height} saved to ${path.join(outputDir, 'logo.png')}`);
