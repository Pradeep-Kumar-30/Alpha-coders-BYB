import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  lat: Number,
  lng: Number,
  routeId: String,
  safetyScore: Number,
  lighting: String,
  crowd: String,
  police: String,
  incidentTags: [String],
  comment: String,
  timestamp: { type: Date, default: Date.now },
  deviceHash: String,
});

const Report = mongoose.model("Report", reportSchema);

export default Report;

