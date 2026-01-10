import {Router} from "express"
import { addPatient } from "../controllers/patient.controllers.js"

const router = Router()


router.route("/register").post(addPatient)

export default router