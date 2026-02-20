import { diffInMinutes } from "./timeutils.js";

/* Haversine distance in meters */
function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // earth radius in meters
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/*
 routeCoords = [ {lat, lng}, {lat, lng}, ... ]
 reports = reports from DB
*/
export function calculateRouteRisk(routeCoords, reports) {
  let score = 0;
  const now = new Date();
  const uniqueDevices = new Set();

  for (let report of reports) {
    if (uniqueDevices.has(report.deviceHash)) continue;
    uniqueDevices.add(report.deviceHash);

    for (let point of routeCoords) {
      const distance = getDistanceMeters(
        point.lat,
        point.lng,
        report.lat,
        report.lng
      );

      if (distance <= 300) {
        const minutesAgo = diffInMinutes(now, report.timestamp);

        if (minutesAgo <= 15) score += 5;
        else if (minutesAgo <= 60) score += 3;
        else if (minutesAgo <= 1440) score += 1;

        break; // no need to check other points
      }
    }
  }

  return score;
}

export function explainRisk(score) {
  if (score <= 5) return "Low Risk Route";
  if (score <= 12) return "Moderate Risk Route";
  return "High Risk Route";
}
