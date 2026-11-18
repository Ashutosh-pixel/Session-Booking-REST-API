import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        min: 0,
        default: 0,
    }

}, { timestamps: true })

const Teacher = mongoose.model("Teacher", teacherSchema)

export default Teacher