import mongoose, { mongo } from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstnace = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb database connected`)
        // console.log(connectionInstnace.connection)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export {connectDB}