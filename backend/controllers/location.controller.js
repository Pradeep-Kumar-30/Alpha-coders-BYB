import User from "../model/user.model.js";

export const updateLocationPermission = async (req, res, next) => {
  try {
    const { userId, allowed } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required"
      });
    }

    await User.findByIdAndUpdate(userId, {
      isLocationAllowed: allowed
    });

    res.json({
      success: true,
      message: "Location permission updated"
    });
  } catch (error) {
    next(error);
  }
};
