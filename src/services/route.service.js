import { AppError } from "../errors/AppError.js";
import * as cityRepository from "../repositories/city.repository.js";
import * as routeRepository from "../repositories/route.repository.js";
import { validateRouteQuery } from "../validators/route.validator.js";

export async function searchDirectRoutes(query) {
  const { fromCityId, toCityId } = validateRouteQuery(query, true);

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

export async function searchRoutesWithStops(query) {
  const { fromCityId, toCityId, maxStops } = validateRouteQuery(query, false);

  const fromCity = await cityRepository.findById(fromCityId);
  if (!fromCity) {
    throw new AppError(404, "Ciudad de origen no encontrada");
  }

  const toCity = await cityRepository.findById(toCityId);
  if (!toCity) {
    throw new AppError(404, "Ciudad de destino no encontrada");
  }

  const baseResponse = {
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
    routes: [],
    count: 0,
    dataSource: "OpenFlights (dataset histórico)"
  };

  if (fromCityId === toCityId) {
    return baseResponse;
  }

  const fromAirports = await cityRepository.findAirportsByCityId(fromCityId);
  const toAirports = await cityRepository.findAirportsByCityId(toCityId);

  if (fromAirports.length === 0 || toAirports.length === 0) {
    return baseResponse;
  }

  const targetAirportIds = new Set(toAirports.map((a) => a.id));
  const flightsCache = new Map();

  async function getFlights(airportId) {
    if (!flightsCache.has(airportId)) {
      flightsCache.set(airportId, await routeRepository.findOutgoingFlights(airportId));
    }
    return flightsCache.get(airportId);
  }

  const queue = [];
  for (const airport of fromAirports) {
    queue.push({
      currentAirportId: airport.id,
      visitedAirports: new Set([airport.id]),
      legs: []
    });
  }

  const routes = [];
  const seenSequences = new Set();
  const maxResults = 20;

  while (queue.length > 0 && routes.length < maxResults) {
    const currentPath = queue.shift();
    const outgoing = await getFlights(currentPath.currentAirportId);

    for (const f of outgoing) {
      if (currentPath.visitedAirports.has(f.destinationAirportId)) {
        continue;
      }

      const leg = {
        airline: f.airlineName ?? null,
        from: {
          iataCode: f.fromIataCode,
          airport: f.fromAirportName,
          city: f.fromCityName
        },
        to: {
          iataCode: f.toIataCode,
          airport: f.toAirportName,
          city: f.toCityName
        }
      };

      const newLegs = [...currentPath.legs, leg];
      const stopsCount = newLegs.length - 1;

      if (targetAirportIds.has(f.destinationAirportId)) {
        const seqKey = [...currentPath.visitedAirports, f.destinationAirportId].join("-");
        if (!seenSequences.has(seqKey)) {
          seenSequences.add(seqKey);
          routes.push({
            stops: stopsCount,
            legs: newLegs
          });
          if (routes.length >= maxResults) {
            break;
          }
        }
      } else if (stopsCount < maxStops) {
        const newVisited = new Set(currentPath.visitedAirports);
        newVisited.add(f.destinationAirportId);
        queue.push({
          currentAirportId: f.destinationAirportId,
          visitedAirports: newVisited,
          legs: newLegs
        });
      }
    }
  }

  return {
    ...baseResponse,
    routes,
    count: routes.length
  };
}
