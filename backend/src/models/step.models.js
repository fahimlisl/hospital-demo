import mongoose, { Schema } from "mongoose";

const historyCheck = new mongoose.Schema({
    age: {
      type: Number,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const visionCheckSecond = new mongoose.Schema(
  {
    distanceVision: {
      type: Boolean,
      default: false,
    },
    nearVision: {
      type: Boolean,
      default: false,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const torchlight = new mongoose.Schema(
  {
    normality: {
      type: Boolean,
      default: false, // flase -> not normal , true -> normal
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const coverUncover = new mongoose.Schema({
  normality: {
    type: Boolean,
    default: false,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

const convergence = new mongoose.Schema(
  {
    normality: {
      type: Boolean,
      default: false,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const purposeSchema = new mongoose.Schema({
  value: {
      type: String,
      required: true,
    },
},{timestamps:true})

const subjective = new mongoose.Schema({
  fogging:{
    type:Boolean,
    default:false // false -> not required , true -> required
  },
  jcc:{
    type:Boolean,
    default:false // false -> not required , true -> required
  },
  duochrome:{
    type:String,
    enum:["red","green","balanced"],
    default:"grey"
  },
  isSubmitted: {
      type: Boolean,
      default: false,
    },
},{timestamps:true})

const nearVision = new mongoose.Schema({
  ans:{
    type:Boolean,
    default:false // flase -> No , true -> Yes
  },
  isSubmitted:{
    type:Boolean,
    default:false
  }
},{timestamps:true})


const repeateSchema = new mongoose.Schema({
  subPrescription:{
    type:Schema.Types.ObjectId,
    ref:"Prescription"
  },
  purpose:{
    type:purposeSchema,
    required:true
  },
  stepFirst: {
    type: [historyCheck],
    default: () => [
      {
        age:0,
        isSubmitted: false,
      },
    ],
  },
  stepSecond: {
    type: [visionCheckSecond],
    default: () => [
      {
        distanceVision: false,
        nearVision: false,
        isSubmitted: false,
      },
    ],
  },
  stepThird: {
    type: [torchlight],
    default: () => [
      {
        normality: false,
        isSubmitted: false,
      },
    ],
  },
  stepFourth: {
    type: [coverUncover],
    default: () => [
      {
        normality: false,
        isSubmitted: false,
      },
    ],
  },
  stepFive: {
    type: [convergence],
    default: () => [
      {
        normality: false,
        isSubmitted: false,
      },
    ],
  },
  stepSix:{
    type:[subjective],
    default: () => [
      {
        fogging:false,
        jcc:false,
        duochrome:"balanced",
        isSubmitted:false
      }
    ]
  },
  stepSeven: {
    type:[nearVision],
    default: () => [
      {
        ans:false, // true -> Yes , flase -> No , in frontend
        isSubmitted:false
      }
    ]
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  isCompleted: { // need this for setting arrayFilter
    type: Boolean,
    default: false,
  },
},{timestamps:true})


const stepSchema = new mongoose.Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  isCompleted: { // don't need this ig as per requirements
    type: Boolean,
    default: false,
  },
  visits:{
    type:[repeateSchema],
    default:() => [{}],
  },
  // this will be wroking as step eight (8)
  prescription:{ // maybe will change the annotaion of it to rxverification later , for now lets keep it as it is
    type: Schema.Types.ObjectId,
    ref:"prescription"
  }
});

export const Step = mongoose.model("Step", stepSchema);
