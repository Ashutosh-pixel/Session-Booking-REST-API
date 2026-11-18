import mongoose from "mongoose";
import { validateSessionTime } from "../lib/common"
import Session from "../schema/sessionSchema";
import Teacher from "../schema/teacherSchema";
import User from "../schema/userSchema";

interface validateSession {
    time: boolean
    teacher: boolean
    session: any
}

export const createSessionService = async (email: string, startTime: string, endTime: string, date: string): Promise<validateSession> => {
    const output = validateSessionTime(date, startTime, endTime);

    if (!output.valid) {
        return {
            time: true,
            teacher: false,
            session: null
        }
    }

    if (!output.startTime || !output.endTime) {
        return {
            time: true,
            teacher: false,
            session: null
        }
    }

    const teacher = await Teacher.findOne({ email })

    if (!teacher) {
        return {
            time: false,
            teacher: true,
            session: null
        }
    }

    const session = await Session.create({ teacherId: teacher._id, startTime: output.startTime, endTime: output.endTime })

    return {
        time: false,
        teacher: false,
        session
    }
}

export const fetchAvailableSessions = async (startDate: Date, endDate: Date) => {
    const output = await Session.aggregate([
        {
            $match: {
                status: "AVAILABLE",
                startTime: { $gte: startDate },
                endTime: { $lt: endDate }
            }
        },
        {
            $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        }
    ])

    return output
}

export const bookSessionService = async (id: string, email: string) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { session: true }
    }

    const user = await User.findOne({ email })

    if (!user) {
        return { user: true };
    }

    const session = await Session.findOneAndUpdate(
        {
            _id: id,
            status: "AVAILABLE"
        },
        {
            $set: {
                status: "BOOKED",
                userId: user._id
            }
        },
        {
            new: true,
            projection: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        }
    )

    if (!session) {
        return { session: true };
    }

    return { booking: session };
}

export const completeSessionService = async (id: string) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { session: true };
    }

    const completedSession = await Session.findOneAndUpdate(
        {
            _id: id,
            status: "BOOKED"
        },
        {
            $set: {
                status: "COMPLETED",
                completedAt: new Date()
            }
        },
        {
            new: true,
            projection: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        }
    );

    if (!completedSession) {
        return { session: true };
    }

    return { completedSession };
};


export const getUserSessionsService = async (id: string) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { user: true };
    }

    const user = await User.findById(id);

    if (!user) {
        return { user: true };
    }

    const result = await Session.aggregate([
        {
            $match: {
                userId: user._id
            }
        },
        {
            $facet: {
                upcomingSessions: [
                    {
                        $match: {
                            status: "BOOKED",
                            startTime: { $gt: new Date() }
                        }
                    },
                    {
                        $sort: { startTime: 1 }
                    },
                    {
                        $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                        }
                    }
                ],
                completedSessions: [
                    {
                        $match: {
                            status: "COMPLETED"
                        }
                    },
                    {
                        $sort: { startTime: -1 }
                    },
                    {
                        $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                        }
                    }
                ]
            }
        }
    ]);

    return {
        upcomingSessions: result[0].upcomingSessions,
        completedSessions: result[0].completedSessions
    };
};
