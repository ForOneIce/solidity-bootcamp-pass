import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Database
const db = new Database('passes.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS passes (
    id TEXT PRIMARY KEY,
    nickname TEXT,
    imageData TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  // API Routes - MUST be defined before static files and wildcard routes
  app.post('/api/share', (req, res) => {
    console.log('Received share request');
    try {
      const { id, nickname, imageData } = req.body;
      console.log('Payload size:', JSON.stringify(req.body).length);
      
      if (!id || !imageData) {
        console.error('Missing data in share request');
        return res.status(400).json({ error: 'Missing data' });
      }
      
      const stmt = db.prepare('INSERT OR REPLACE INTO passes (id, nickname, imageData) VALUES (?, ?, ?)');
      stmt.run(id, nickname, imageData);
      console.log('Successfully saved pass:', id);
      
      res.json({ success: true, id });
    } catch (error) {
      console.error('Share error:', error);
      res.status(500).json({ error: 'Internal server error', details: String(error) });
    }
  });

  app.get('/api/image/:id', (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('SELECT imageData FROM passes WHERE id = ?');
      const row = stmt.get(id) as { imageData: string } | undefined;

      if (!row) {
        return res.status(404).send('Not found');
      }

      // Remove data:image/png;base64, prefix
      const base64Data = row.imageData.replace(/^data:image\/\w+;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
    } catch (error) {
      console.error('Image fetch error:', error);
      res.status(500).send('Error');
    }
  });

  // Share Page (Twitter Card Target)
  app.get('/share/:id', (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('SELECT nickname FROM passes WHERE id = ?');
      const row = stmt.get(id) as { nickname: string } | undefined;

      if (!row) {
        return res.redirect('/');
      }

      const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
      const imageUrl = `${appUrl}/api/image/${id}`;
      const title = `${row.nickname}'s Solidity Bootcamp Pass`;
      const description = "Check out my onboard pass for the Solidity Bootcamp! #WomenInWeb3";

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          
          <!-- Twitter Card data -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${imageUrl}">
          
          <!-- Open Graph data -->
          <meta property="og:title" content="${title}" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="${appUrl}/share/${id}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:description" content="${description}" />

          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
          <div class="max-w-2xl w-full space-y-8 text-center">
            <h1 class="text-3xl font-bold font-serif">${title}</h1>
            <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img src="${imageUrl}" alt="Pass" class="w-full h-auto" />
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="/" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold transition-colors">
                Create Your Own Pass
              </a>
            </div>
          </div>
        </body>
        </html>
      `;
      
      res.send(html);
    } catch (error) {
      console.error('Share page error:', error);
      res.redirect('/');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        // Don't intercept API or share routes - although express.static handles files, 
        // this catch-all is for SPA routing.
        // Explicitly check again to be safe, though route order should prevent this.
        if (req.path.startsWith('/api/') || req.path.startsWith('/share/')) {
          return res.status(404).send('Not found');
        }
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
