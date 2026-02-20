import Report from "../model/Report.model.js";
import { calculateRouteRisk } from "../services/riskEngine.js";
import { rankRoutesWithRotation } from "../services/routeRanker.js";

export const rankRoutes = async (req, res) => {
  try {
    const { routes } = req.body;

    // Get all recent reports (last 24h optional filter)
    const reports = await Report.find({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    for (let route of routes) {
      // Convert geometry into {lat,lng} format
      const routeCoords = route.geometry.map((coord) => ({
        lat: coord[0],
        lng: coord[1],
      }));

      route.risk = calculateRouteRisk(routeCoords, reports);
    }

    const ranked = rankRoutesWithRotation(routes);

    res.json(ranked);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ranking routes" });
  }
};
