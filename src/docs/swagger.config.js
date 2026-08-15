import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import config from "../config/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsGlob = path.join(__dirname, "**", "*.yaml").replace(/\\/g, "/");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "shipnow",
      version: "1.0.0",
      description: "Documentación de la API de shipnow",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "local",
      },
    ],
  },
  apis: [docsGlob],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
