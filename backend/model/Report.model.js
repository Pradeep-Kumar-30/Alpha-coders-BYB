import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  routeId: String,
  timestamp: Date,
  deviceHash: String,
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
