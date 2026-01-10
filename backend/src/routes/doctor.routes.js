import {Router} from "express"
import { addVisit, fetchAllPatient, fetchAllVisit, fetchParticularVisit, finalSubmit, firstStepEdit, loginDoctor, logOutDoctor, removePatient, secondStepEdit, stepFiveEdit, stepFourthEdit, stepSevenEdit, stepSixEdit, stepThirdEdit } from "../controllers/doctor.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { addPatient, countPatient } from "../controllers/patient.controllers.js"
import { noOfCompletedCheckuP } from "../controllers/step.controllers.js"
import { fetchParticularPrecriptionPerStep, prescriptionP } from "../controllers/prescription.controllers.js"


const router = Router()

router.route("/login").post(loginDoctor)
router.route("/logout").post(verifyJWT,logOutDoctor)

// patient 
router.route("/addVisit/:id").post(verifyJWT,addVisit)
router.route("/fetchAllPatient").get(verifyJWT,fetchAllPatient)
router.route("/fetchPatient/:id").get(verifyJWT,fetchAllVisit)
router.route("/addPatient").post(verifyJWT,addPatient)
router.route("/removePatient/:id").delete(verifyJWT,removePatient)
router.route("/fetchAllVisit/:id").get(verifyJWT,fetchAllVisit)
router.route("/fetchParticularVisit/:id").get(verifyJWT,fetchParticularVisit)


// patient edit route
router.route("/check/:id").patch(verifyJWT,firstStepEdit)
router.route("/secondStep/:id").patch(verifyJWT,secondStepEdit)
router.route("/thirdStep/:id").patch(verifyJWT,stepThirdEdit)
router.route("/foruthStep/:id").patch(verifyJWT,stepFourthEdit)
router.route("/fifthStep/:id").patch(verifyJWT,stepFiveEdit)
router.route("/sixthStep/:id").patch(verifyJWT,stepSixEdit)
router.route("/sevenStep/:id").patch(verifyJWT,stepSevenEdit)
router.route("/finalSubmit/:id").patch(verifyJWT,finalSubmit)


// additonal paitent routes
router.route("/countPatient").get(verifyJWT,countPatient)
router.route("/countSuccess").get(verifyJWT,noOfCompletedCheckuP)


// precreiption routes
router.route("/updatePrescription/:id").patch(verifyJWT,prescriptionP)
router.route("/fethParticularPrecription/:id").get(verifyJWT,fetchParticularPrecriptionPerStep)


// 
router.route("/verify").get(verifyJWT, (req, res) => {
  res.status(200).json({ success: true });
});

export default router