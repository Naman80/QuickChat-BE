import "dotenv/config.js";
import express from "express";
import routes from "./routes/index.ts";

const app = express();

app.use(express.json()); // ← for JSON bodies (most common today)
app.use(express.urlencoded({ extended: true })); // ← for form submissions (optional)

app.use(routes);

export default app;
