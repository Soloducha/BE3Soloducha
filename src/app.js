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

//404 error handler
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrado" });
});

export default app;
