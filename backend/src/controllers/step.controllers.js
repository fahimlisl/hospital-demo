import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Patient } from "../models/patient.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Step } from "../models/step.models.js";

const noOfCompletedCheckuP = asyncHandler(async(req,res) => {
    const noofComplete = await Step.find({
        visits:{
            $elemMatch:{isCompleted:true}
        }
    })
    .countDocuments({})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            noofComplete,
            "fetched no of counts"
        )
    )
})

export {noOfCompletedCheckuP}