import jwt from "jsonwebtoken";
import ApiError from "../classes/ApiError.js";

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (
      authHeader == null ||
      authHeader == undefined ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw ApiError.Unauthorized("You are unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (payload == null || payload == undefined) {
      throw ApiError.Unauthorized("Invalid token");
    }

    req.user = { ...payload };
    next();
    return;
  } catch (e) {
    next(e);
  }
};

export default isAuth;
