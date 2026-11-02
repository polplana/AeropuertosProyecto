import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";
import {
  list,
  listWithAirports,
  listAirports,
  create,
  update
} from "../controllers/city.controller.js";

export const cityRouter = Router();

cityRouter.use(authenticate);

cityRouter.get("/", list);
cityRouter.get("/with-airports", listWithAirports);
cityRouter.get("/:id/airports", listAirports);
cityRouter.post("/", authorizeAdmin, create);
cityRouter.put("/:id", authorizeAdmin, update);
