const functions = require('firebase-functions');
const buildApp = require('./app');

let appPromise;

exports.api = functions.https.onRequest(async (req, res) => {
  if (!appPromise) {
    appPromise = buildApp();
  }
  const app = await appPromise;
  await app.ready();
  app.server.emit('request', req, res);
});