import { diffInMinutes } from "./timeutils.js";

export function calculateRiskScore(reports, now) {
  let score = 0;
  const uniqueDevices = new Set();

  for (let report of reports) {
    const minutesAgo = diffInMinutes(now, report.timestamp);

    if (uniqueDevices.has(report.deviceHash)) continue;
    uniqueDevices.add(report.deviceHash);

    if (minutesAgo <= 15) score += 3;
    else if (minutesAgo <= 60) score += 2;
    else if (minutesAgo <= 1440) score += 1;
  }

  return score;
}

export function explainRisk(score) {
  if (score <= 3) return "Lower recent risk";
  if (score <= 7) return "Moderate recent risk";
  return "Increased recent risk";
}
