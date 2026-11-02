import * as cityService from "../services/city.service.js";

export async function list(req, res) {
  const cities = await cityService.listCities(req.query.search);
  return res.status(200).json(cities);
}

export async function listWithAirports(req, res) {
  const cities = await cityService.listCitiesWithAirports();
  return res.status(200).json(cities);
}

export async function listAirports(req, res) {
  const airports = await cityService.listAirportsByCity(req.params.id);
  return res.status(200).json(airports);
}

export async function create(req, res) {
  const city = await cityService.createCity(req.body);
  return res.status(201).json(city);
}

export async function update(req, res) {
  const city = await cityService.updateCity(req.params.id, req.body);
  return res.status(200).json(city);
}

