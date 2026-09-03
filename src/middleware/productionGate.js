import config from "../config/index.js";

/**
 * Middleware que bloquea rutas de utilidad/desarrollo en producción.
 * Incluye: mocks, logger test.
 *
 * Swagger (/api/docs) queda abierto en todos los entornos por ahora;
 * se protegerá con basic auth cuando se implemente autenticación.
 */
export const productionGate = (req, res, next) => {
  if (config.nodeEnv === "production") {
    return res.status(403).json({
      status: "error",
      error: "FORBIDDEN",
      message: "Este endpoint no está disponible en producción",
    });
  }
  next();
};
