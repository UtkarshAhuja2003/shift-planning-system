import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JSON Web Token (JWT) from the Authorization header.
 * @throws {ApiError} If the token is missing, invalid, or the user is not found.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id);

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  }
);

/**
 * @param {UserRolesEnum} roles
 * @description
 *  Validate multiple user role permissions at a time.
 */
export const verifyPermission = (roles = []) =>
    asyncHandler(async (req, res, next) => {
      if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized request");
      }
      if (roles.includes(req.user?.role)) {
        next();
      } else {
        throw new ApiError(403, "You are not allowed to perform this action");
      }
    }
);