import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas de la API
app.use("/api", apiRouter);

//health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    status: err.status || "error",
    message: err.message,
  });
});

//404 error handler
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
