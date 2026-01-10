import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Prescription } from "../models/rXverification.models.js";

const prescriptionP = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const { visitId } = req.body; 

  const {
    sphericalLB, cylindricalLB, axisLB, pupilDistanceLB, addPowerLB,
    sphericalRB, cylindricalRB, axisRB, pupilDistanceRB, addPowerRB,

    sphericalLN, cylindricalLN, axisLN, pupilDistanceLN, addPowerLN,
    sphericalRN, cylindricalRN, axisRN, pupilDistanceRN, addPowerRN,

    sphericalLF, cylindricalLF, axisLF, pupilDistanceLF, addPowerLF,
    sphericalRF, cylindricalRF, axisRF, pupilDistanceRF, addPowerRF,
  } = req.body;

  await Prescription.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set: {
        // bifocal
        "prescription.$[p].bifocal.0.rightEye": {
          spherical: sphericalRB,
          cylindrical: cylindricalRB,
          axis: axisRB,
          pupilDistance: pupilDistanceRB,
          addPower: addPowerRB,
        },
        "prescription.$[p].bifocal.0.leftEye": {
          spherical: sphericalLB,
          cylindrical: cylindricalLB,
          axis: axisLB,
          pupilDistance: pupilDistanceLB,
          addPower: addPowerLB,
        },

        // near
        "prescription.$[p].nearVisionPower.0.rightEye": {
          spherical: sphericalRN,
          cylindrical: cylindricalRN,
          axis: axisRN,
          pupilDistance: pupilDistanceRN,
          addPower: addPowerRN,
        },
        "prescription.$[p].nearVisionPower.0.leftEye": {
          spherical: sphericalLN,
          cylindrical: cylindricalLN,
          axis: axisLN,
          pupilDistance: pupilDistanceLN,
          addPower: addPowerLN,
        },

        // far
        "prescription.$[p].farVisionPower.0.rightEye": {
          spherical: sphericalRF,
          cylindrical: cylindricalRF,
          axis: axisRF,
          pupilDistance: pupilDistanceRF,
          addPower: addPowerRF,
        },
        "prescription.$[p].farVisionPower.0.leftEye": {
          spherical: sphericalLF,
          cylindrical: cylindricalLF,
          axis: axisLF,
          pupilDistance: pupilDistanceLF,
          addPower: addPowerLF,
        },
      },
    },
    {
      arrayFilters: [
        { "p.subStep": visitId } 
      ],
      new: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "Prescription updated successfully")
  );
});


const fetchParticularPrecriptionPerStep = asyncHandler(async(req,res) =>{
    // will be mapped in fronted according to design
    const patientId = req.params.id;
    const result = await Prescription.findOne(
        {
            patient:patientId
        }
    ).select("-step -patient -createdAt -updatedAt -__v")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "fetched successfully"
        )
    )
})

export {prescriptionP,fetchParticularPrecriptionPerStep}