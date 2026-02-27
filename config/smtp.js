const process = require('process');

function createTransportOptions() {
  const secure = process.env.SMTP_SECURE === 'true';
  const host = process.env.SMTP_HOST || '';
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : (secure ? 465 : 587);
  const requireTLS = process.env.SMTP_REQUIRE_TLS === 'true';
  const rejectUnauthorized = process.env.SMTP_REJECT_UNAUTHORIZED === 'true';

  const auth = (process.env.SMTP_USER || process.env.SMTP_PASS) ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined;

  const transporterOptions = {
    host,
    port,
    secure: secure,
    auth,
    requireTLS,
    tls: {
      rejectUnauthorized
    }
  };

  return transporterOptions;
}

module.exports = { createTransportOptions };
