import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.models.js";
import { options } from "../utils/options.js";
import generateAccessAndRefreshToken from "../utils/generateA&RT.js";
import { Doctor } from "../models/doctor.models.js";


const adminRegister = asyncHandler(async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  if ([username, email, password, phoneNumber].some((t) => !t && t !== 0)) {
    throw new ApiError(401, "all fields are required");
  }

  const checkUser = await Admin.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (checkUser) {
    throw new ApiError(400, "user already exits");
  }

  const createUser = await Admin.create({
    username,
    phoneNumber,
    email,
    password,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createUser, "Admin created Successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password, phoneNumber } = req.body;
  if (!(email || phoneNumber)) {
    throw new ApiError(400, "at least one field is required");
  }

  const foundUser = await Admin.findOne({
    $or:[
      {email},{phoneNumber}
    ]
  })

  if(!foundUser) throw new ApiError(400,"User not found")
 
  if (!password) throw new ApiError(400, "password is required");

  const bcyrptedPassword = await foundUser.isPasswordCorrect(password);

  if (!bcyrptedPassword) throw new ApiError(400, "pasword didn't matched");


  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(foundUser._id,Admin)

  return res
  .status(200)
  .cookie("accessToken" , accessToken , options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      foundUser,
      "User loggedIN successfully"
    )
  )
});

const logoutAdmin = asyncHandler(async(req,res) => {
  const userId = req.user._id
  await Admin.findByIdAndUpdate(userId,
    {
      $unset:{
        refreshToken:""
      }
    },
    {
      new:true
    }
  );

  return res
  .status(200)
  .clearCookie("refreshToken",options)
  .clearCookie("accessToken",options)
  .json(
    new ApiResponse(
      200,
      {},
      "Admin Logged OUt succesfully"
    )
  )
})

const fetchAllDoctors = asyncHandler(async(req,res) =>{
  const doctors = await Doctor.find({})


  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      doctors,
      "all doctors have been fetched successfully"
    )
  )
})

const noOfDoctors = asyncHandler(async(req,res) => {
  const count = await Doctor.countDocuments({})

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      count,
      "no of counts are fetched succesfully"
    )
  )
})

const updateDoctor = asyncHandler(async(req,res) => {
  const doctorId = req.params.id;
  const {fullName,email,phoneNumber,qualification,department} = req.body;

  if(!(email || fullName || phoneNumber || qualification || department)) throw new ApiError(401,"at least one field is requried")

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    {
      $set:{
        fullName,
        email,
        phoneNumber,
        qualification,
        department
      }
    },
    {
      new:true
    }
  ).select("-password -refreshToken")
  if(!doctor) throw new ApiError(500,"fialed to updated doctor")

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      doctor,
      "doctor updated Succesfully"
    )
  )
})



export { adminRegister, loginAdmin ,logoutAdmin};

export {noOfDoctors,fetchAllDoctors,updateDoctor}

// max to max limit per day 2 to 3 eyetests
