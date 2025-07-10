import jwt from "jsonwebtoken";

// func to get the tokem

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
};
