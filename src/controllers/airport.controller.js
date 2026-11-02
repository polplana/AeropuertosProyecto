import * as airportService from "../services/airport.service.js";

export async function list(req, res) {
  const airports = await airportService.listAirports(req.query.cityId);
  return res.status(200).json(airports);
}

export async function getById(req, res) {
  const airport = await airportService.getAirportById(req.params.id);
  return res.status(200).json(airport);
}

export async function create(req, res) {
  const airport = await airportService.createAirport(req.body);
  return res.status(201).json(airport);
}

export async function update(req, res) {
  const airport = await airportService.updateAirport(req.params.id, req.body);
  return res.status(200).json(airport);
}

