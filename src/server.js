import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import apiRouter from "./routes/index.js";

import config from "./config/config.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

const PORT = config.port;
const MONGODB_URI = config.mongoUri;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  });

export default app;
