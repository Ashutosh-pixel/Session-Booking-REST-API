import mongoose, { Schema } from "mongoose"

const sessionSchema = new mongoose.Schema({
    teacherId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "BOOKED", "COMPLETED"],
        default: "AVAILABLE"
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true })

const Session = mongoose.model("Session", sessionSchema)

export default Session