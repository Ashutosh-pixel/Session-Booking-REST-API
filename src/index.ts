import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import connectDB from "./database/connection";
import userController from "./controller/user.controller";
import teacherController from "./controller/teacher.controller";
import { bookSessionController, completeSessionController, createSessionController, getAvailableSessions, getUserSessionsController } from "./controller/session.controller";

dotenv.config()

const app = express();

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "hello" })
})

const startServer = async () => {
    await connectDB()

    app.listen(process.env.PORT, () => {
        console.log("Server started on port", process.env.PORT)
    })
}

app.post("/users", userController)
app.post("/teachers", teacherController)
app.post("/sessions", createSessionController)
app.get("/sessions/available", getAvailableSessions)
app.post("/sessions/:id/book", bookSessionController)
app.patch("/sessions/:id/complete", completeSessionController)
app.get("/users/:id/sessions", getUserSessionsController)

startServer();