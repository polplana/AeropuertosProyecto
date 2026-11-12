import { Router } from "express";
import {
  searchCities,
  getCityAirports
} from "../controllers/public.controller.js";

export const publicRouter = Router();

publicRouter.get("/cities", searchCities);
publicRouter.get("/cities/:id/airports", getCityAirports);
