const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load base .env then override with .env.local if present (local development)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const localPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(localPath)) {
  dotenv.config({ path: localPath });
}

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const app = await require('./app');
    await app.listen({ port: Number(PORT), host: 'localhost' });
    console.log(`Server listening on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
