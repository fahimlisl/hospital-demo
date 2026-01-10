import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.models.js";
import { options } from "../utils/options.js";
import generateAccessAndRefreshToken from "../utils/generateA&RT.js";
import { Step } from "../models/step.models.js";
import { Patient } from "../models/patient.models.js";
import { Prescription } from "../models/rXverification.models.js";

const registerDoctor = asyncHandler(async (req, res) => {
  const { phoneNumber, email, fullName, department, qualification, password } =
    req.body;

  if (
    [phoneNumber, email, fullName, department, qualification, password].some(
      (t) => !t && t !== 0
    )
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  const checkExistance = await Doctor.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (checkExistance) throw new ApiError(400, "Doctor already exits");

  const createdDoctor = await Doctor.create({
    email,
    phoneNumber,
    department,
    qualification,
    fullName,
    password,
  });

  if (!createdDoctor)
    throw new ApiError(400, "fialed to create Docotr , chceck bakcend");

  return res
    .status(200)
    .json(new ApiResponse(200, createdDoctor, "doctor created Successfully"));
});

const loginDoctor = asyncHandler(async (req, res) => {
  const { phoneNumber, email, password } = req.body;
  const foundUser = await Doctor.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!foundUser) {
    throw new ApiError(400, "Doctor was not added");
  }

  const checkPassord = await foundUser.isPasswordCorrect(password);

  if (!checkPassord)
    throw new ApiError(401, "invalid crednetials , password incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    foundUser._id,
    Doctor
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Doctor Login Successful"
      )
    );
});

const logOutDoctor = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await Doctor.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out successfully"));
});

const removeDoctor = asyncHandler(async (req, res) => {
  const docotrId = req.params.id;
  if (!docotrId) throw new ApiError(400, "kindly provide proper docotr id ");
  const deleteTED = await Doctor.findByIdAndDelete(docotrId);
  if (!deleteTED) throw new ApiError(500, "wasn't able to delte docotor");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "doctor deleted successfully"));
});

const addVisit = asyncHandler(async (req, res) => {
  const { purpose } = req.body;
  const patientId = req.params.id;
  const stepDoc = await Step.findOne({ patient: patientId });
  if (!stepDoc) throw new ApiError(404, "Step not found");

  const prevAge = stepDoc.visits[0].stepFirst[0].age;

  const updatedStep = await Step.findOneAndUpdate(
    { patient: patientId },
    {
      $push: {
        visits: {
          purpose: { value: purpose },
          stepFirst: [{ age: prevAge }],
        },
      },
    },
    { new: true }
  );

  const newVisit =
    updatedStep.visits[updatedStep.visits.length - 1];

  const updatedPrescription =
    await Prescription.findOneAndUpdate(
      { patient: patientId },
      {
        $push: {
          prescription: {
            subStep: newVisit._id,
          },
        },
      },
      { new: true }
    );

  const newSubPrescription =
    updatedPrescription.prescription[
      updatedPrescription.prescription.length - 1
    ];

  await Step.findOneAndUpdate(
    {
      patient: patientId,
      "visits._id": newVisit._id,
    },
    {
      $set: {
        "visits.$.subPrescription": newSubPrescription._id,
      },
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        visitId: newVisit._id,
        subPrescriptionId: newSubPrescription._id,
      },
      "New visit & prescription linked successfully"
    )
  );
});


// will filter patients by name or phonenumber via frontend
const fetchAllPatient = asyncHandler(async (req, res) => {
  const allPatient = await Patient.find({});
  // will add validation later if needed
  return res
    .status(200)
    .json(
      new ApiResponse(200, allPatient, "successFully fetched all patients")
    );
});

const fetchAllVisit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const patient = await Patient.findById(patientId).populate("steps");
  // .select("-fullName -email -DOB -age -phoneNumber"); // according to need , will get these detials also
  if (!patient) throw new ApiError(400, "failed to find patient");
  return res
    .status(200)
    .json(new ApiResponse(200, patient, "fetched Patient Successfully"));
});

// api endpoints for editing feilds

const firstStepEdit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  await Step.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set: {
        "visits.$[visit].stepFirst.$[step].isSubmitted": true,
      },
    },
    {
      arrayFilters: [
        { "visit.isCompleted": false },
        { "step.isSubmitted": false },
      ],
      new: true,
    }
  );

  return res.status(200).json(new ApiResponse(200, {}, "edited succesfully"));
});

const secondStepEdit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const { distanceVision, nearVision } = req.body;
  console.log(distanceVision);
  await Step.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set: {
        "visits.$[visit].stepSecond.$[variable].distanceVision": distanceVision,
        // ture or flase , should be taken from forntend
        "visits.$[visit].stepSecond.$[variable].nearVision": nearVision,
        "visits.$[visit].stepSecond.$[variable].isSubmitted": true,
      },
    },
    {
      arrayFilters: [
        { "visit.isCompleted": false },
        // { "variable.isSubmitted": !distanceVision },
        { "variable.isSubmitted": false },
        // for now will just save one time then can update for toggle accoriding to frontend
      ],
      new: true,
    }
  );

  return res.status(200).json(new ApiResponse(200, {}, "second field updated"));
});

const stepThirdEdit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const { normality, isSubmitted } = req.body;
  await Step.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set: {
        "visits.$[visit].stepThird.$[step].normality": normality,
        "visits.$[visit].stepThird.$[step].isSubmitted": isSubmitted,
      },
    },
    {
      arrayFilters: [
        { "visit.isCompleted": false },
        { "step.isSubmitted": false },
      ],
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "fileds updated successfully"));
});

const stepFourthEdit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const { normality, isSubmitted } = req.body;
  await Step.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set: {
        "visits.$[visit].stepFourth.$[step].normality": normality,
        "visits.$[visit].stepFourth.$[step].isSubmitted": true,
      },
    },
    {
      arrayFilters: [
        { "visit.isCompleted": false },
        { "step.isSubmitted": false },
      ],
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "updated step four successfully"));
});

const stepFiveEdit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const { normality, isSubmitted } = req.body;
  await Step.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set: {
        "visits.$[visit].stepFive.$[step].normality": normality,
        "visits.$[visit].stepFive.$[step].isSubmitted": true,
      },
    },
    {
      arrayFilters: [
        { "visit.isCompleted": false },
        { "step.isSubmitted": false },
      ],
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "updated step Five successfully"));
});

const stepSixEdit = asyncHandler(async(req,res) => {
  const patientId = req.params.id;
  const {fog,jcc,duochrome} = req.body;
  await Step.findOneAndUpdate(
    {
      patient:patientId
    },
    {
      $set:{
        "visits.$[visit].stepSix.$[step].fogging":fog, // true -> required , false -> not required
        "visits.$[visit].stepSix.$[step].jcc":jcc,  // true -> required , false -> not required
        "visits.$[visit].stepSix.$[step].duochrome":duochrome, // there's enum of enum:["red","brown","grey"], there should be dropdown boxes for selection in forntend for only these three
        "visits.$[visit].stepSix.$[step].isSubmitted":true
      }
    },
    {
      arrayFilters:[
       { "visit.isCompleted":false},
        {"step.isSubmitted":false}
      ],
      new:true
    }
  )

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "step six submitted and edited succesfully"
    )
  )
})

const stepSevenEdit = asyncHandler(async(req,res) => {
  const patientId = req.params.id;
  const {ans} = req.body;
  await Step.findOneAndUpdate(
    {
      patient:patientId
    },
    {
      $set:{
        "visits.$[visit].stepSeven.$[step].ans":ans,
        "visits.$[visit].stepSeven.$[step].isSubmitted":true,

      }
    },
    {
      arrayFilters:[
        {"visit.isCompleted":false},
        {"step.isSubmitted":false}
      ],
      new:true
    }
  )

  return res
  .status(200)
  .json(
     new ApiResponse(
      200,
      {},
      "step seven updated and edited successfully"
     )
  )
})


const finalSubmit = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  await Step.findOneAndUpdate(
    {
      patient: patientId,
    },
    {
      $set:{
        "visits.$[visit].isCompleted":true
      }
    },
    {
      arrayFilters:[
        {"visit.isCompleted":false}
      ],
      new:true
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "final submission successful"));
});


const removePatient = asyncHandler(async(req,res) => {
  const patientId = req.params.id;
  const pat = await Patient.findByIdAndDelete(patientId)
  if(!pat) throw new ApiError(500 , "wasn't able to delete the patient")
  const s = await Step.findOneAndDelete({patient:patientId})
  if(!s) throw new ApiError(500,"wasn't able to delete the step document")
  const p = await Prescription.findOneAndDelete({patient:patientId})
  if(!p) throw new ApiError(500,"wasn't able to delete the prescription document")
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "successfully deleted the patient and patient step docuemtn along"
    )
  )
})

const fetchAllVisitOfParticular = asyncHandler(async(req,res) => {
  const patientId = req.params.id;
  const step = await Step.findOne({patient:patientId})
  if(!step) throw new ApiError(400,"wasn't able to find any step")
  const all = step.visits


  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      all,
      "all visits are fetched succesfully"
    )
  )
})

const fetchParticularVisit = asyncHandler(async(req,res) => {
  const visitId = req.params.id
  const visit = await Step.findOne({
    visits:{
      $elemMatch:{_id:visitId}
    }
  })
  const response = visit.visits.find((t) => t._id == visitId)
  console.log(response)

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      response,
      "fetched specifiec visit successfully"
    )
  )

})

export { loginDoctor, registerDoctor, logOutDoctor, removeDoctor };

export {
  addVisit,
  fetchAllVisit,
  fetchAllPatient,
  firstStepEdit,
  secondStepEdit,
  stepThirdEdit,
  stepFourthEdit,
  stepFiveEdit,
  stepSixEdit,
  stepSevenEdit,
  finalSubmit,
  removePatient,
  fetchAllVisitOfParticular,
  fetchParticularVisit
};