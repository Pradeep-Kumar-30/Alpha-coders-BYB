import Report from "../model/Report.model.js";
import { calculateRiskScore } from "../services/riskEngine.js";
import { rankRoutesWithRotation } from "../services/routeRanker.js";


export const rankRoutes = async (req, res) => {
  try {
    const { routes } = req.body;
    const now = new Date();

    for (let route of routes) {
      const reports = await Report.find({ routeId: route.id });
      route.risk = calculateRiskScore(reports, now);
    }
  
    const ranked = rankRoutesWithRotation(routes);

    res.json(ranked);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ranking routes" });
  }
};
