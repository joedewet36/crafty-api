import validator from 'validator';
import { sendContactAndAutoReply } from '../../services/emailService.js';

function sanitizeInput(value) {
  if (!value || typeof value !== 'string') return '';
  let v = value.replace(/\r|\n|%0a|%0d/gi, ' ');
  v = validator.escape(v);
  return v.trim();
}

function getCorsHeaders(req) {
  const allowedOrigin = Netlify.env.get('CLIENT_ORIGIN') || 'https://www.craftydesignstudio.co.za';
  const origin = req.headers.get('origin');

  let responseOrigin = allowedOrigin;
  if (origin === allowedOrigin) {
    responseOrigin = origin;
  } else if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    responseOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': responseOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default async (req, context) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, message: 'Invalid request body' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const { name, email, phone, subject, message, package: pkg } = body || {};

    if (!name || !email || !phone || !subject || !message) {
      return Response.json(
        { success: false, message: 'All fields are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!validator.isEmail(String(email))) {
      return Response.json(
        { success: false, message: 'Invalid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    const payload = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      package: pkg ? sanitizeInput(pkg) : ''
    };

    await sendContactAndAutoReply(payload);

    return Response.json(
      { success: true, message: 'Message sent successfully' },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('Contact function error:', err);
    return Response.json(
      { success: false, message: 'Failed to send message' },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const config = {
  path: '/api/contact',
  method: ['POST', 'OPTIONS'],
};
