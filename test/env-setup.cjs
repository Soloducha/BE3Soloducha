// Carga .env.test ANTES de que cualquier módulo ESM invoque config/index.js.
// CommonJS a propósito: mocha --require lo ejecuta antes del loader ESM.
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env.test") });
