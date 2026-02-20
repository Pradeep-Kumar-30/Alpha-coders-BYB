function normalize(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

export function rankRoutesWithRotation(routes) {
  if (!routes || routes.length === 0) return [];

  // Extract risk & duration ranges
  const risks = routes.map(r => r.risk || 0);
  const durations = routes.map(r => r.duration || 0);

  const minRisk = Math.min(...risks);
  const maxRisk = Math.max(...risks);

  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  // Normalize and compute balanced score
  routes.forEach(route => {
    const normRisk = normalize(route.risk, minRisk, maxRisk);
    const normDuration = normalize(route.duration, minDuration, maxDuration);

    // 60% safety, 40% time weight
    route.balancedScore = (normRisk * 0.6) + (normDuration * 0.4);
  });

  // SAFEST = lowest risk
  const safest = [...routes].sort((a, b) => a.risk - b.risk)[0];

  // FASTEST = lowest duration
  const fastest = [...routes].sort((a, b) => a.duration - b.duration)[0];

  // BALANCED = lowest combined score
  const balanced = [...routes].sort((a, b) => a.balancedScore - b.balancedScore)[0];

  return [
    { ...safest, label: "Safest Route" },
    { ...balanced, label: "Balanced Route" },
    { ...fastest, label: "Fastest Route" }
  ];
}
