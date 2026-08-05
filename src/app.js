import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { reqLogger } from "./middleware/requestLogger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(reqLogger);
//Rutas de la API
app.use("/api", apiRouter);

//health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
//Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
