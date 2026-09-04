import fs from 'node:fs';
import path from 'node:path';

export const config = {
  includeFiles: ['site/video/part0.js', 'site/video/part1.js', 'site/video/part2.js', 'site/video/part3.js', 'site/video/part4.js'],
};

function readPart(i) {
  const file = fs.readFileSync(path.join(process.cwd(), 'site', 'video', `part${i}.js`), 'utf8');
  const re = new RegExp(`SPIRAL_VIDEO_PART_${i}\\s*=\\s*['\"]([A-Za-z0-9+/=]+)['\"]`);
  const match = file.match(re);
  if (!match) throw new Error(`video part ${i} missing`);
  return match[1];
}

export default function handler(_req, res) {
  try {
    const b64 = [0, 1, 2, 3, 4].map(readPart).join('');
    const buffer = Buffer.from(b64, 'base64');
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', String(buffer.length));
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
    return res.status(200).send(buffer);
  } catch {
    return res.status(500).send('video unavailable');
  }
}
