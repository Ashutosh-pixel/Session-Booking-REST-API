import mongoose from "mongoose";


const MongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/assignment"

const connectDB = async () => {
    if (!MongoURI) {
        throw new Error("MongoDB URI is not defined")
    }
    try {
        await mongoose.connect(MongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

export default connectDB