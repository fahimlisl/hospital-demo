import { Router } from "express";
import { adminRegister, fetchAllDoctors, loginAdmin, logoutAdmin, noOfDoctors, updateDoctor } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { registerDoctor, removeDoctor } from "../controllers/doctor.controllers.js";

const router = Router();

router.route("/register").post(adminRegister);
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyJWT,logoutAdmin)

// docotor
router.route("/registerDoc").post(verifyJWT,registerDoctor)
router.route("/removeDoc/:id").delete(verifyJWT,removeDoctor)
router.route("/countOfDoc").get(verifyJWT,noOfDoctors)
router.route("/fetchAllDoctor").get(verifyJWT,fetchAllDoctors)
router.route("/updateDoctor/:id").patch(verifyJWT,updateDoctor)


router.route("/verify").get(verifyJWT, (req, res) => {
  res.status(200).json({ success: true });
});

export default router;
