/**
 * Local form submission mock — mimics Formspree's JSON API.
 * Run alongside `astro dev` to test the contact form locally.
 *
 * Usage:  node dev/form-mock.mjs
 * Listens on http://localhost:4320 (configurable via PORT env var).
 */

import { createServer } from 'node:http';

const PORT = process.env.PORT || 4320;

const server = createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    });
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString();
    const contentType = req.headers['content-type'] || '';

    let fields = {};
    if (contentType.includes('multipart/form-data')) {
      // Parse multipart boundaries (simple extraction)
      const boundary = contentType.split('boundary=')[1];
      if (boundary) {
        body.split(`--${boundary}`).forEach((part) => {
          const match = part.match(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)(?:\r?\n)?$/);
          if (match) fields[match[1]] = match[2].trim();
        });
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      fields = Object.fromEntries(new URLSearchParams(body));
    } else {
      try { fields = JSON.parse(body); } catch { fields = { raw: body }; }
    }

    // Filter out honeypot and empty values
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([k, v]) => k !== 'website' && v)
    );

    const timestamp = new Date().toLocaleTimeString();
    console.log('\n┌─────────────────────────────────────────');
    console.log(`│  📬  Form submission received  ${timestamp}`);
    console.log('├─────────────────────────────────────────');
    for (const [key, value] of Object.entries(filtered)) {
      const display = value.length > 80 ? value.substring(0, 80) + '…' : value;
      console.log(`│  ${key.padEnd(12)} ${display}`);
    }
    console.log('└─────────────────────────────────────────\n');

    // Respond like Formspree
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ ok: true, next: '/' }));
  });
});

server.listen(PORT, () => {
  console.log(`\n🔧 Form mock server running at http://localhost:${PORT}`);
  console.log('   Submissions will be logged here.\n');
});
