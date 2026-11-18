import Teacher from "../schema/teacherSchema"

const teacherService = async (fullName: string, email: string, specialization: string, experience: number) => {
    try {
        const output = await Teacher.findOne({ email }, { email: 1 })

        if (output) {
            return null
        }

        // create teacher
        const resp = await Teacher.create({ fullName, email, specialization, experience })

        return resp;
    } catch (error) {
        console.log("error in teacherserive", error)
    }
}

export default teacherService