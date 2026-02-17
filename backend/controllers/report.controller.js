import Report from "../model/Report.model.js";
import { hashValue } from "../utils/hash.js";

export const submitReport = async (req, res, next) => {
  try {
    console.log("📝 Report submission received");
    console.log("Request body:", req.body);

    const {
      userId,
      lat,
      lng,
      routeId,
      safetyScore,
      lighting,
      crowd,
      police,
      incidentTags,
      comment,
      deviceId,
    } = req.body;

    // Validate required fields
    if (lat === undefined || lat === null) {
      console.log("❌ Missing lat");
      return res.status(400).json({
        success: false,
        message: "lat is required",
      });
    }

    if (lng === undefined || lng === null) {
      console.log("❌ Missing lng");
      return res.status(400).json({
        success: false,
        message: "lng is required",
      });
    }

    if (safetyScore === undefined || safetyScore === null) {
      console.log("❌ Missing safetyScore");
      return res.status(400).json({
        success: false,
        message: "safetyScore is required",
      });
    }

    if (!deviceId) {
      console.log("❌ Missing deviceId");
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    const deviceHash = hashValue(deviceId);

    const report = await Report.create({
      userId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      routeId,
      safetyScore: parseInt(safetyScore),
      lighting,
      crowd,
      police,
      incidentTags,
      comment,
      deviceHash,
      timestamp: new Date(),
    });

    console.log("✅ Report saved to database:", report._id);
    
    res.status(201).json({
      success: true,
      reportId: report._id,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("❌ Report submission error:", error);
    next(error);
  }
};

export const getReportsByLocation = async (req, res, next) => {
  try {
    const { lat, lng, radius = 1 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "lat and lng are required",
      });
    }

    const reports = await Report.find({
      lat: { $gte: lat - radius, $lte: lat + radius },
      lng: { $gte: lng - radius, $lte: lng + radius },
    });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    next(error);
  }
};
