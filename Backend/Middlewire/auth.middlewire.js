import jwt from "jsonwebtoken";
import { User } from "../Models/User.models.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request - Token not found");
    }

    const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid access token - User not found");
    }

    // 🔥 Clean minimal user object attach
    
    req.user = {
        _id: user._id,
        email: user.email,
        role: user.role
    };

    next();
});
