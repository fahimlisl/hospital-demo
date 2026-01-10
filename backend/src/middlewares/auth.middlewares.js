import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";


import { Doctor } from "../models/doctor.models.js"
import { Admin } from "../models/admin.models.js"
import { Patient } from "../models/patient.models.js"

const roleModelMap = {
  doctor: Doctor,
  admin: Admin,
  patient: Patient,
};


export const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const Model = roleModelMap[decoded.role];
    if (!Model) throw new ApiError(401, "Invalid role");

    const user = await Model.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "User not found");

    req.user = user;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid token");
  }
};