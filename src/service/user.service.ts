import User from "../schema/userSchema";

const userService = async (fullName: string, email: string, phone: string) => {
    try {
        const output = await User.findOne({ email }, { email: 1 });

        if (output) {
            return null;
        }

        // create user
        const resp = await User.create({ fullName, email, phone });

        return resp;

    } catch (error) {
        console.log("error in userserive", error)
    }
}

export default userService