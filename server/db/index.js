import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB error: ",error.message);
        process.exit(1);
        
    }

}

export default connectDB;