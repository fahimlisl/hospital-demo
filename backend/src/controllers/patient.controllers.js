import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Patient } from "../models/patient.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Step } from "../models/step.models.js";
import { Prescription } from "../models/rXverification.models.js";


const addPatient = asyncHandler(async(req,res) => {
    const {
        fullName,
        phoneNumber,
        email,
        DOB,
        // age,
        purpose,
        gender
    } = req.body;
    if(!fullName && !DOB && !gender){
        throw new ApiError(400,"these fields must required")
    }

    const calculateAge = (new Date).getFullYear() - DOB;

    const check = await Patient.findOne({phoneNumber}) // max to max 2-3 user allowed per day from same number

    if (check) {
        throw new ApiError(400,"Patient already exists")
    }
    const createUser = await Patient.create({
        email : email || "",
        fullName,
        phoneNumber,
        DOB,
        age:calculateAge,
        gender
    })
    if(!createUser){
        throw new ApiError(401,"wasn't able to create Patitnet")
    }
    const setpP = await Step.create({
        patient:createUser._id,
        visits:[
            {
                purpose:{
                    value:purpose
                },
                stepFirst:[
                    {
                        age:calculateAge
                    }
                ]
            }
        ]
    })
    // test purpose
    console.log(`getting the value of setpP.visits[0]._id ${setpP.visits[0]._id}`)

    if(!setpP){
        await Patient.deleteOne({_id : createUser._id})
        throw new ApiError(400,"wasn't able to create Patient")
    }

    const prescription = await Prescription.create({
        patient:createUser._id,
        step:setpP._id,
        prescription:[ // lets see wheather we need $set field or directly app
            {
                subStep:setpP.visits[0]._id
            }
        ]
    })

    if(!prescription){
        await Step.findByIdAndDelete(setpP._id)
        await Patient.findByIdAndDelete(createUser._id)
        throw new ApiError(500,"wasn't able to create prescription document")
    }
    const updatePatientDocument = await Patient.findByIdAndUpdate(createUser._id,
        {
            $set:{
                steps:setpP._id,
                prescription:prescription._id,
            }
        }
    )

    
    if(!updatePatientDocument){
        await Patient.deleteOne({_id : createUser._id})
        await Step.deleteOne({_id : setpP._id})
        await Prescription.findByIdAndDelete(prescription._id)
        throw new ApiError(400,"wasn't able to create Patient and document of patient and steps are deleted successfully")
    }

    const updateStepDocuemnt = await Step.findOneAndUpdate(
  {
    _id: setpP._id,
    "visits._id": setpP.visits[0]._id
  },
  {
    $set:{
      "visits.$.subPrescription": prescription.prescription[0]._id,
      prescription: prescription._id
    }
  },
  { new:true }
);

    if(!updateStepDocuemnt){
        await Step.findByIdAndDelete(setpP._id)
        await Patient.findByIdAndDelete(createUser._id)
        await Prescription.findByIdAndDelete(prescription._id)
        throw new ApiError(500,"successfuflyy deleted all the documents , cuz got field in contorller")
    }

    const finalUser = await Patient.findById(createUser._id).populate("steps").populate("prescription")


    if(!finalUser){
        await Patient.findByIdAndDelete(createUser._id)
        await Step.findOneAndDelete({patient:createUser._id})
        await Prescription.findByIdAndDelete(prescription)
        throw new ApiError(500,"failed to create patient")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            finalUser,
            "Patient created Successfully"
        )
    )

})


const countPatient = asyncHandler(async(req,res) => {
    const noPatient = await Patient.countDocuments({})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            noPatient,
            "patient counted successfully"
        )
    )
})

export {addPatient , countPatient}