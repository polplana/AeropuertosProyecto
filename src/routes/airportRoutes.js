import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";
import {
  list,
  getById,
  create,
  update
} from "../controllers/airport.controller.js";

export const airportRouter = Router();

airportRouter.use(authenticate);

airportRouter.get("/", list);
airportRouter.get("/:id", getById);
airportRouter.post("/", authorizeAdmin, create);
airportRouter.put("/:id", authorizeAdmin, update);
