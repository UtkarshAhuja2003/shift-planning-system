import jwt from "jsonwebtoken";
import { UserRolesEnum } from "../constants.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, name } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    email,
    password,
    name,
    role: role || UserRolesEnum.EMPLOYEE,
  });

  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: '',
      },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save();
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating the access token"
      );
    }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =  req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser
};
