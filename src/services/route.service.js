import { AppError } from "../errors/AppError.js";
import * as cityRepository from "../repositories/city.repository.js";
import * as routeRepository from "../repositories/route.repository.js";
import { validateRouteQuery } from "../validators/route.validator.js";

export async function searchDirectRoutes(query) {
  const { fromCityId, toCityId } = validateRouteQuery(query);

  const fromCity = await cityRepository.findById(fromCityId);
  if (!fromCity) {
    throw new AppError(404, "Ciudad de origen no encontrada");
  }

  const toCity = await cityRepository.findById(toCityId);
  if (!toCity) {
    throw new AppError(404, "Ciudad de destino no encontrada");
  }

  const rows = await routeRepository.findDirectRoutes(fromCityId, toCityId);

  const routes = rows.map((r) => ({
    stops: 0,
    legs: [
      {
        airline: r.airlineName ?? null,
        from: {
          iataCode: r.fromIataCode,
          airport: r.fromAirportName,
          city: r.fromCityName
        },
        to: {
          iataCode: r.toIataCode,
          airport: r.toAirportName,
          city: r.toCityName
        }
      }
    ]
  }));

  return {
    from: {
      cityId: fromCity.id,
      city: fromCity.name,
      country: fromCity.country
    },
    to: {
      cityId: toCity.id,
      city: toCity.name,
      country: toCity.country
    },
    routes,
    count: routes.length,
    dataSource: "OpenFlights (dataset histórico)"
  };
}
