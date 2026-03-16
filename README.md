# Crafty Contact API

Fastify-based REST API to receive contact form submissions and send emails (business notification + auto-reply).

Quick start (Local Node.js)

1. Copy `.env.example` to `.env` and update SMTP settings.

2. (Optional) For local overrides create a `.env.local` file. The server loads `.env` first and then `.env.local` if present.
2. Install dependencies (ensure firebase-functions is installed):

```bash
npm install firebase-functions firebase-admin
```

3. Start server:

```bash
npm start
```

API

- POST /api/contact
  - Body (JSON): `name`, `email`, `phone`, `subject`, `message`
  - Response success:

```json
{ "success": true, "message": "Message sent successfully" }
```

Security & SMTP notes

- SSL: set `SMTP_SECURE=true` to use implicit SSL (port 465). The transport sets `secure: true` and typically uses port 465.
- STARTTLS: set `SMTP_SECURE=false` and `SMTP_REQUIRE_TLS=true` to use STARTTLS (port 587). This connects unencrypted then upgrades with TLS.
- `SMTP_REJECT_UNAUTHORIZED=false` will disable certificate verification (useful for local dev/self-signed certs). WARNING: disabling it reduces security—never disable in production.

Localhost / CORS note

- During development (when `NODE_ENV` is not `production`) or when using `npm start` the server will accept any localhost origin (e.g. `http://localhost:3000`) to make testing easier. In production, set `CLIENT_ORIGIN` explicitly to your website origin (for example `https://www.craftydesignstudio.co.za`).

Templates

Templates live in `/templates` as JSON files with `subject`, `html`, and `text`. They use EJS for placeholder replacements.

Assets

Place the base64-encoded PNG in `assets/logo.base64.txt` or update `services/emailService.js` to load your preferred file format.
