export const fetchOSRMRoutes = async (from, to, mode = "car") => {
  if (!from || !to) {
    throw new Error("Invalid start or destination");
  }

  const profileMap = {
    walk: "foot",
    bike: "bike",
    car: "driving",
  };

  const profile = profileMap[mode] || "driving";

  const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&alternatives=true`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.code !== "Ok" || !data.routes) {
    throw new Error("OSRM route fetch failed");
  }

  return data.routes;
};

