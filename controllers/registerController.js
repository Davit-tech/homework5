import fs from "fs/promises";
import {generateMD5Hash} from "../utils/helpers.js";
import {v4 as uuidv4} from "uuid";
import createError from "http-errors";

const title = "Register";
const usersFile = "./public/users/userinfo.json";

export default {
    getRegister: async (req, res) => {
        res.render("register", {title});
    },
    register: async (req, res, next) => {
        const {firstname, lastname, email, password} = req.body;
        const hash = generateMD5Hash(generateMD5Hash(password));
        console.log("Registration hash:", hash);
        console.log(req.body);
        let users = [];

        try {
            const data = await fs.readFile(usersFile, "utf8");
            users = JSON.parse(data);
        } catch (error) {
            console.log("No existing users file, starting fresh.");
        }

        const existingUsers = users.find((user) => user.email === email);
        if (existingUsers) {
            return next(
                createError(
                    400,
                    "User with this email already exists. Please try another one"
                )
            );
        }
        const userId = uuidv4();
        const newUser = {id: userId, firstname, lastname, email, password: hash};
        users.push(newUser);

        try {
            await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
            req.session.userId = userId;
            res.status(200).json({
                success: true,
                message: "Registration successful!",
                messageType: "success",
            });
        } catch (err) {
            return next(createError(500, "An error occurred during registration"));
        }
    },
};
