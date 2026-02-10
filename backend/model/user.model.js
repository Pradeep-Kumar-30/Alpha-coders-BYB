import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  fingerprint: {
    type: String,
    required: true
  },
  isLocationAllowed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

export default User;
