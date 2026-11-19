import { Router } from "express";
import {
  searchCities,
  getCityAirports,
  searchDirectRoutes
} from "../controllers/public.controller.js";

export const publicRouter = Router();

publicRouter.get("/cities", searchCities);
publicRouter.get("/cities/:id/airports", getCityAirports);
publicRouter.get("/routes/direct", searchDirectRoutes);
