import jwt from "jsonwebtoken";
import User from "../models/User.js";

// midleware function to protect the things i mean the routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found !" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth.js error: ", error.message);
    res.json({ success: false, message: error.message });
  }
};
