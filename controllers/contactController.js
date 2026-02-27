const emailService = require('../services/emailService');
const validator = require('validator');

function sanitizeInput(value) {
  if (!value || typeof value !== 'string') return '';
  // Remove header injection attempts and strip tags
  let v = value.replace(/\r|\n|%0a|%0d/gi, ' ');
  v = validator.escape(v);
  return v.trim();
}

async function handleContact(request, reply) {
  try {
    const { name, email, phone, subject, message } = request.body || {};

    if (!name || !email || !phone || !subject || !message) {
      return reply.status(400).send({ success: false, message: 'All fields are required' });
    }

    if (!validator.isEmail(String(email))) {
      return reply.status(400).send({ success: false, message: 'Invalid email address' });
    }

    const payload = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    };

    await emailService.sendContactAndAutoReply(payload);

    return reply.send({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: 'Failed to send message' });
  }
}

module.exports = { handleContact };
