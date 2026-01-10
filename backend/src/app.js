import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(morgan('combined'))
app.use(cookieParser())
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))


// routes
import adminRotuer from "./routes/admin.routes.js"
import patientRouter from "./routes/patient.routes.js"
import doctorRotuer from "./routes/doctor.routes.js"
import prescriptionRouter from "./routes/prescriptionPDF.routes.js"

app.use("/api/v1/admin",adminRotuer)
app.use("/api/v1/patient",patientRouter)
app.use("/api/v1/doctor",doctorRotuer)
app.use("/api/v1/prescriptions",prescriptionRouter)


app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

export {app}