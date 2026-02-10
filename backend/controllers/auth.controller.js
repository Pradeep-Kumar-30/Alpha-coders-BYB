import User from "../model/user.model.js";
import { hashValue } from "../utils/hash.js";

export const anonymousLogin = async (req, res, next) => {
  try {
    let { deviceId, fingerprint } = req.body;

    if (!deviceId || !fingerprint) {
      return res.status(400).json({
        success: false,
        message: "deviceId and fingerprint required"
      });
    }

    deviceId = hashValue(deviceId);
    fingerprint = hashValue(fingerprint);

    let user = await User.findOne({ deviceId, fingerprint });

    if (!user) {
      user = await User.create({ deviceId, fingerprint });
    }

    res.status(200).json({
      success: true,
      userId: user._id,
      message: "Anonymous login successful"
    });
  } catch (error) {
    next(error);
  }
};
