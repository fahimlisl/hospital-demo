import mongoose,{Schema} from "mongoose";

const eyeSchema = new mongoose.Schema({
    rightEye:{
        spherical:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        cylindrical:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        axis:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        pupilDistance:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        addPower:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        }
    },
    leftEye:{
        spherical:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        cylindrical:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        axis:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        pupilDistance:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        },
        addPower:{
            type:Number,
            default:0 // in forntend for defualt: 0 , show "-"
        }
    }
},{timestamps:true})

const repeatPrescription = new mongoose.Schema({
        subStep:{
            type:Schema.Types.ObjectId,
            ref:"Step"
        },
        bifocal: {
        type:[eyeSchema],
        default:() => [
            {
                rightEye:{
                    spherical:0,
                    cylindrical:0,
                    axis:0,
                    pupilDistance:0,
                    addPower:0
                },
                leftEye:{
                    spherical:0,
                    cylindrical:0,
                    axis:0,
                    pupilDistance:0,
                    addPower:0
                },
            }
        ]
    }, // in frontend should be bifocal/progressive power
    nearVisionPower:{
        type:[eyeSchema],
        default:() => [
            {
                rightEye:{
                    spherical:0,
                    cylindrical:0,
                    axis:0,
                    pupilDistance:0,
                    addPower:0
                },
                leftEye:{
                    spherical:0,
                    cylindrical:0,
                    axis:0,
                    pupilDistance:0,
                    addPower:0
                },
            }
        ]
    }, // in fornted name will be near vision power
    farVisionPower:{
        type:[eyeSchema],
        default:() => [
            {
                rightEye:{
                    spherical:0,
                    cylindrical:0,
                    axis:0,
                    pupilDistance:0,
                    addPower:0
                },
                leftEye:{
                    spherical:0,
                    cylindrical:0,
                    axis:0,
                    pupilDistance:0,
                    addPower:0
                },
            }
        ]
    } // frontend -> Far Vision Power
},{timestamps:true})

const prescriptionSchema = new mongoose.Schema({
    patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    },
    step:{
        type:Schema.Types.ObjectId,
        ref:"Step"
    },
    prescription:{
        type:[repeatPrescription],
        default: () => [{}],
    }
},{timestamps:true})

// later may have to add next date for visit !!

export const Prescription = mongoose.model("Prescription",prescriptionSchema)