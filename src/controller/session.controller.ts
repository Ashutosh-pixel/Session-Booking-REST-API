import type { Request, Response } from "express"
import { bookSessionService, completeSessionService, createSessionService, fetchAvailableSessions, getUserSessionsService } from "../service/session.service";
import Session from "../schema/sessionSchema";

export const createSessionController = async (req: Request, res: Response) => {
    let { email, date, startTime, endTime } = req.body;

    try {

        if (typeof email !== "string" || typeof startTime !== "string" || typeof endTime !== "string" || typeof date !== "string") {
            return res.status(400).json({ error: "invalid payload" });
        }

        email = email.trim()
        startTime = startTime.trim()
        endTime = endTime.trim()
        date = date.trim()

        if (!email || !startTime || !endTime || !date) {
            return res.status(400).json({ error: "payload is missing" })
        }

        const session = await createSessionService(email, startTime, endTime, date);

        if (session.time) {
            return res.status(400).json({ error: "invalid date or time range" })
        }

        if (session.teacher) {
            return res.status(404).json({ error: "teacher not found" })
        }

        if (!session.session) {
            throw new Error("session creation failed")
        }

        res.status(201).json({ message: "session created successfuly", id: session.session._id });

    } catch (error) {
        console.log("error in sessioncontroller", error);
        res.status(500).json({ error: "session creation failed" })
    }
}

export const getAvailableSessions = async (req: Request, res: Response) => {

    const { dateTimeStamp } = req.query

    if (typeof dateTimeStamp !== "string") {
        return res.status(400).json({ error: "invalid date" });
    }

    const startDate = new Date(dateTimeStamp);
    const endDate = new Date(startDate);

    endDate.setUTCDate(endDate.getUTCDate() + 1);


    try {
        const output = await fetchAvailableSessions(startDate, endDate)

        res.status(200).json({ output })
    } catch (error) {
        console.log("error in getSessioncontroller", error);
        res.status(500).json({ error: "fetching sessions failed" })
    }
}


export const bookSessionController = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { email } = req.body;

    try {
        if (typeof id !== "string" || typeof email !== "string") {
            return res.status(400).json({ error: "invalid payload" });
        }

        email = email.trim();

        if (!email) {
            return res.status(400).json({ error: "email is missing" });
        }

        const result = await bookSessionService(id, email);

        if (result.user) {
            return res.status(404).json({ error: "user not found" });
        }

        if (result.session) {
            return res.status(404).json({ error: "session not found or already booked" });
        }

        if (!result.booking) {
            throw new Error("session booking failed");
        }

        return res.status(201).json({
            message: "session booked successfully",
            booking: result.booking
        });

    } catch (error) {
        console.log("error in bookSessionController", error);
        res.status(500).json({ error: "session booking failed" });
    }
};


export const completeSessionController = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        if (typeof id !== "string") {
            return res.status(400).json({ error: "invalid session id" });
        }

        const result = await completeSessionService(id);

        if (result.session) {
            return res.status(404).json({ error: "session not found or not booked" });
        }

        if (!result.completedSession) {
            throw new Error("session completion failed");
        }

        return res.status(201).json({
            message: "session completed successfully",
            session: result.completedSession
        });

    } catch (error) {
        console.log("error in completeSessionController", error);
        res.status(500).json({ error: "session completion failed" });
    }
};


export const getUserSessionsController = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        if (typeof id !== "string") {
            return res.status(400).json({ error: "invalid user id" });
        }

        const result = await getUserSessionsService(id);

        if (result.user) {
            return res.status(404).json({ error: "user not found" });
        }

        res.status(200).json({
            upcomingSessions: result.upcomingSessions,
            completedSessions: result.completedSessions
        });

    } catch (error) {
        console.log("error in getUserSessionsController", error);
        res.status(500).json({ error: "fetching user sessions failed" });
    }
};
