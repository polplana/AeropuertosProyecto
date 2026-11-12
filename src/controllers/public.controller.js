import * as cityService from "../services/city.service.js";

export async function searchCities(req, res) {
  const cities = await cityService.listCities(req.query.search);
  return res.status(200).json(cities);
}

export async function getCityAirports(req, res) {
  const airports = await cityService.listAirportsByCity(req.params.id);
  return res.status(200).json(airports);
}
