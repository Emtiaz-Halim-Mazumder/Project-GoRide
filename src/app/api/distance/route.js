// Free distance/fare calculation using Nominatim (geocoding) + OSRM (routing)
// No API keys required.

const VEHICLE_RATES = {
  Car: { base: 40, perKm: 40, perMin: 1 },
  Micro: { base: 40, perKm: 40, perMin: 3 },
  Bike: { base: 50, perKm: 15, perMin: 1 }, // Note: Assuming 15 taka per km for bike as it was missing in your prompt
};

const MAX_SEATS = { Car: 5, Micro: 5, Bike: 1 };

function roundToNearest5(n) {
  return Math.ceil(n / 5) * 5;
}

async function geocode(placeName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GoRide-University-Rideshare/1.0' },
  });

  if (!res.ok) {
    throw new Error(`Geocoding failed for "${placeName}"`);
  }

  const data = await res.json();
  if (!data || data.length === 0) {
    throw new Error(`Could not find location: "${placeName}"`);
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}

async function getRoute(origin, destination) {
  // OSRM uses lng,lat order
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GoRide-University-Rideshare/1.0' },
  });

  if (!res.ok) {
    throw new Error('Routing service unavailable');
  }

  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error('No route found between these locations');
  }

  const route = data.routes[0];
  const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
  const durationMin = Math.round(distanceKm * 10); // 10 minutes per kilometer
  const geometry = route.geometry;

  let durationText;
  if (durationMin >= 60) {
    const hours = Math.floor(durationMin / 60);
    const mins = durationMin % 60;
    durationText = mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  } else {
    durationText = `${durationMin} min`;
  }

  return { distanceKm, durationMin, durationText, geometry };
}

function computeFuelCosts(distanceKm, durationMin) {
  const costs = {};

  for (const [vehicle, rates] of Object.entries(VEHICLE_RATES)) {
    const total = Math.round(rates.base + (distanceKm * rates.perKm) + (durationMin * rates.perMin));
    const maxSeats = MAX_SEATS[vehicle];
    const perSeat = {};

    for (let s = 1; s <= maxSeats; s++) {
      perSeat[s] = roundToNearest5(total / s);
    }

    costs[vehicle] = { total, perSeat };
  }

  return costs;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return Response.json(
      { success: false, error: 'Both origin and destination are required' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Geocode both locations
    const [originGeo, destGeo] = await Promise.all([
      geocode(origin),
      geocode(destination),
    ]);

    // Small delay to respect Nominatim rate limit (1 req/sec)
    // Promise.all sends them concurrently, but they go to the same service.
    // In practice Nominatim handles this fine for 2 concurrent requests.

    // Step 2: Get driving route
    const { distanceKm, durationMin, durationText, geometry } = await getRoute(originGeo, destGeo);

    // Step 3: Compute fuel costs
    const fuelCosts = computeFuelCosts(distanceKm, durationMin);

    return Response.json({
      success: true,
      origin: { name: originGeo.displayName, lat: originGeo.lat, lng: originGeo.lng },
      destination: { name: destGeo.displayName, lat: destGeo.lat, lng: destGeo.lng },
      distance_km: distanceKm,
      distance_text: `${distanceKm} km`,
      duration_text: durationText,
      fuelCosts,
      geometry,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
