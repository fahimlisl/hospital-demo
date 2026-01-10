import mongoose, { Schema } from "mongoose";

const patientSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true 
    },
    email:{
        type:String,
    },
    DOB:{ // gotta put restrictions there , to avoid mis conufcions in year detials
        type:Number
    },
    gender:{
        type:String,
        enum:["Male","Female","Prefer Not To Say"],
        required:true
    },
    steps:{
        type: Schema.Types.ObjectId,
        ref:"Step"
    },
    age:{
        type:Number,
        // required:true
    },
    prescription:{
        type:Schema.Types.ObjectId,
        ref:"Prescription"
    }
},{timestamps:true})

export const Patient = mongoose.model("Patient",patientSchema)