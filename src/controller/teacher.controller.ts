import type { Request, Response } from "express";
import teacherService from "../service/teacher.service";

const teacherController = async (req: Request, res: Response) => {
    let { fullName, email, specialization, experience } = req.body;

    try {
        fullName = fullName.trim();
        email = email.trim();
        specialization = specialization.trim();

        if (!fullName || !email || !specialization) {
            return res.status(400).json({ error: "payload is missing" })
        }

        const output = await teacherService(fullName, email, specialization, experience);

        if (!output) {
            return res.status(409).json({ error: "teacher already exists with this email" })
        }

        res.status(201).json({ message: "teacher created successfully", id: output._id })
    } catch (error) {
        console.log("error in teachercontroller", error);
        res.status(500).json({ error: "teacher creation failed" })
    }
}

export default teacherController