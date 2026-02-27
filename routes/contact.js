const contactController = require('../controllers/contactController');

async function routes(fastify, opts) {
  fastify.post('/contact', contactController.handleContact);
}

module.exports = routes;
