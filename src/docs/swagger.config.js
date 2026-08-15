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
      description:
        "Documentación de la API de shipnow. Permite consultar y probar los endpoints de usuarios, productos, pedidos, entregas, mocks y logger.",
    },
    tags: [
      { name: "Users", description: "Gestión de usuarios" },
      { name: "Products", description: "Gestión de productos" },
      { name: "Orders", description: "Gestión de pedidos y actualización de estado" },
      { name: "Deliveries", description: "Gestión de entregas y actualización de estado" },
      { name: "Mocks", description: "Generación de datos de prueba (con y sin persistencia)" },
      {
        name: "Logger",
        description:
          "Herramienta de validación del logger, no una funcionalidad de negocio",
      },
    ],
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
