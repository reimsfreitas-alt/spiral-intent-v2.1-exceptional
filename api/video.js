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

function getVideoBuffer() {
  const b64 = [0, 1, 2, 3, 4].map(readPart).join('');
  return Buffer.from(b64, 'base64');
}

export default function handler(req, res) {
  try {
    const buffer = getVideoBuffer();
    const total = buffer.length;
    const range = req.headers.range;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');

    if (!range) {
      res.setHeader('Content-Length', String(total));
      return res.status(200).send(buffer);
    }

    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      res.setHeader('Content-Range', `bytes */${total}`);
      return res.status(416).end();
    }

    let start;
    let end;
    if (match[1] === '') {
      const suffixLength = Math.min(Number(match[2]), total);
      start = total - suffixLength;
      end = total - 1;
    } else {
      start = Number(match[1]);
      end = match[2] === '' ? total - 1 : Number(match[2]);
    }

    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= total || end < start) {
      res.setHeader('Content-Range', `bytes */${total}`);
      return res.status(416).end();
    }

    end = Math.min(end, total - 1);
    const chunk = buffer.subarray(start, end + 1);
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Content-Length', String(chunk.length));
    res.setHeader('Content-Disposition', 'inline');
    return res.send(chunk);
  } catch {
    return res.status(500).send('video unavailable');
  }
}
