import { StatusCodes } from "http-status-codes";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "../../../constants/index.js";
import postData from "../services/post.js";
import bcrypt from "bcrypt";
import { getDataByEmail } from "../db/index.js";
import { generateToken } from "../../../helpers/index.js";

const { CREATED, INTERNAL_SERVER_ERROR, BAD_REQUEST, CONFLICT } = StatusCodes;

const postController = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) return res.status(BAD_REQUEST).json({ message: "All fields are required." });

    const existingUser = await getDataByEmail(email);

    if (existingUser) {
        return res.status(CONFLICT).json({ message: "Email already exists." });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const data = await postData({ ...req.body, password: hashPassword });
        const token = generateToken({ email });

        res.cookie("token", token, {
            secure: false
        });
        res.status(CREATED).json({
            status: CREATED,
            user: {
                id: data._id,
                fullName: data.fullName,
                email: data.email,
                role: data.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).send({ status: INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
}

export default postController;