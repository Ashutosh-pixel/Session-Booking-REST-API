import type { Request, Response } from "express"
import userService from "../service/user.service";

const userController = async (req: Request, res: Response) => {
    let { fullName, email, phone } = req.body;

    try {
        fullName = fullName.trim();
        email = email.trim();
        phone = phone.trim();

        if (!fullName || !email || !phone) {
            return res.status(400).json({ error: "payload is missing" })
        }

        const output = await userService(fullName, email, phone)

        if (!output) {
            return res.status(409).json({ error: "user already exists with this email" })
        }

        res.status(201).json({ message: "user created successfully", id: output._id })

    } catch (error) {
        console.log("error in usercontroller", error);
        res.status(500).json({ error: "user creation failed" })
    }
}

export default userController