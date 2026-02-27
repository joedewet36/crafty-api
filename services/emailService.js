const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { createTransportOptions } = require('../config/smtp');

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@craftydesignstudio.co.za';
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function loadTemplate(name) {
  const htmlPath = path.join(TEMPLATES_DIR, `${name}.html`);
  const txtPath = path.join(TEMPLATES_DIR, `${name}.txt`);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const text = fs.readFileSync(txtPath, 'utf8');
  return { html, text };
}

function loadSubjects() {
  const subjectsPath = path.join(TEMPLATES_DIR, 'subjects.json');
  const raw = fs.readFileSync(subjectsPath, 'utf8');
  return JSON.parse(raw);
}

function getLogoBuffer() {
  const logoPath = path.join(ASSETS_DIR, 'logo5.png');
  if (!fs.existsSync(logoPath)) return null;
  const buffer = fs.readFileSync(logoPath);
  return buffer;
}

function buildTransporter() {
  const opts = createTransportOptions();
  // remove undefined auth if not provided
  if (!opts.auth || !opts.auth.user) delete opts.auth;
  return nodemailer.createTransport(opts);
}

async function sendContactAndAutoReply({ name, email, phone, subject, message }) {
  const transporter = buildTransporter();

  const businessTpl = loadTemplate('contact-notification');
  const autoTpl = loadTemplate('auto-reply');
  const subjects = loadSubjects();

  const logoBuffer = getLogoBuffer();
  const attachments = [];
  if (logoBuffer) {
    attachments.push({
      filename: 'logo.png',
      content: logoBuffer,
      cid: 'craftylogo@craftydesignstudio'
    });
  }

  // Prepare business email
  const businessHtml = ejs.render(businessTpl.html, { name, email, phone, subject, message });
  const businessText = ejs.render(businessTpl.text, { name, email, phone, subject, message });
  const businessSubject = ejs.render(subjects.businessNotification, { subject });

  const businessMail = {
    from: FROM_EMAIL,
    to: FROM_EMAIL,
    replyTo: email,
    subject: businessSubject,
    html: businessHtml,
    text: businessText,
    attachments
  };

  // Send to business
  await transporter.sendMail(businessMail);

  // Prepare auto-reply
  const autoHtml = ejs.render(autoTpl.html, { name, email, phone, subject, message });
  const autoText = ejs.render(autoTpl.text, { name, email, phone, subject, message });
  const autoSubject = subjects.autoReply;

  const autoMail = {
    from: FROM_EMAIL,
    to: email,
    subject: autoSubject,
    html: autoHtml,
    text: autoText,
    attachments
  };

  // Send auto-reply
  await transporter.sendMail(autoMail);
}

module.exports = { sendContactAndAutoReply };
