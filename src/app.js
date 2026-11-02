import 'dotenv/config';
import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { cityRouter } from "./routes/cityRoutes.js";
import { airportRouter } from "./routes/airportRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/cities", cityRouter);
app.use("/api/airports", airportRouter);

app.use("/auth", authRouter);
app.use("/cities", cityRouter);
app.use("/airports", airportRouter);

app.get("/", (_req, res) => res.json({ name: "API Node.js operativa", express: true }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => console.log(`API escuchando en ${port}`));

export { app };
