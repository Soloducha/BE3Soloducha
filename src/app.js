import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { reqLogger } from "./middleware/requestLogger.js";
import { swaggerSpec } from "./docs/swagger.config.js";
import swaggerUi from "swagger-ui-express";
import upload from "./middleware/uploadMiddleware.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload());

app.use(reqLogger);
//Rutas de la API
app.use("/api", apiRouter);

//ejemplo de uso de upload de imagenes
// app.post("/api/documents", upload.single("document"), (req, res) => {
//   res.json({ status: "success", file: req.file });
// });

//health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

//Swagger UI
//TODO: proteger /api/docs con basic auth cuando se implemente
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
