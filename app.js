const path = require("path");
const Fastify = require("fastify");
const helmet = require("@fastify/helmet");
const cors = require("@fastify/cors");
const rateLimit = require("@fastify/rate-limit");
const contactRoutes = require("./routes/contact");

require("dotenv").config();

async function buildApp() {
  const app = Fastify({ logger: true });

  // Security headers
  await app.register(helmet);

  // CORS - allow configured origin and localhost during development/npm start
  const clientOrigin =
    process.env.CLIENT_ORIGIN || "https://www.craftydesignstudio.co.za";
    const clientOrigin2 =
    process.env.CLIENT_ORIGIN2 || "https://pc-docta.netlify.app";
  const allowLocalhost =
    (process.env.NODE_ENV || "").toLowerCase() !== "production" ||
    process.env.npm_lifecycle_event === "start";

  await app.register(cors, {
    origin: function (origin, cb) {
      // allow non-browser requests (like curl/postman) with no origin
      if (!origin) return cb(null, true);
      if (clientOrigin && origin === clientOrigin) return cb(null, true);
      if (clientOrigin2 && origin === clientOrigin2) return cb(null, true);
      if (
        allowLocalhost &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      )
        return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Routes
  await app.register(contactRoutes, { prefix: "/api" });

  // Centralized error handler
  app.setErrorHandler(function (error, request, reply) {
    const status = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    reply.status(status).send({ success: false, message });
  });
  app.get("/", async (request, reply) => {
    return { API_Status: "All Good" };
  });

  return app;
}

module.exports = buildApp();
