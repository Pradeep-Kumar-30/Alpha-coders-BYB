function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function groupBySimilarScore(routes) {
  const groups = {};

  routes.forEach(route => {
    const bucket = Math.floor(route.risk / 2);
    if (!groups[bucket]) groups[bucket] = [];
    groups[bucket].push(route);
  });

  return Object.values(groups);
}

function pickSlightlyLongerSafeRoute(routes) {
  return routes.find(r => r.risk <= 3) || routes[0];
}

export function rankRoutesWithRotation(routes) {
  routes.sort((a, b) => a.risk - b.risk);

  const grouped = groupBySimilarScore(routes);
  grouped.forEach(group => shuffle(group));

  const decoy = pickSlightlyLongerSafeRoute(routes);
  routes.push(decoy);

  return shuffle(routes).slice(0, 3);
}
