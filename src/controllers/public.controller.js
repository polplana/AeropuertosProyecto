import * as cityService from "../services/city.service.js";
import * as routeService from "../services/route.service.js";

export async function searchCities(req, res) {
  const cities = await cityService.listCities(req.query.search);
  return res.status(200).json(cities);
}

export async function getCityAirports(req, res) {
  const airports = await cityService.listAirportsByCity(req.params.id);
  return res.status(200).json(airports);
}

export async function searchDirectRoutes(req, res) {
  const result = await routeService.searchDirectRoutes(req.query);
  return res.status(200).json(result);
}
