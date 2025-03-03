import createError from "http-errors";
import fs from "fs/promises";
import {generateMD5Hash} from "../utils/helpers.js";

const usersFile = "./public/users/userinfo.json";

export default {
    getLogin: async (req, res) => {
        res.render("login", {title: "Login"});
    },

    login: async (req, res, next) => {
        const {email, password} = req.body;

        const hash = generateMD5Hash(generateMD5Hash(password));

        let users = [];
        try {
            const data = await fs.readFile(usersFile, "utf8");
            users = JSON.parse(data);
        } catch (err) {
            console.log("Error reading users file:", err);
            return next(createError(500, "Server error. Please try again later."));
        }

        const user = users.find((user) => user.email === email);
        if (!user) {
            return next(createError(400, "Invalid email. Please try again."));
        }

        if (user.password !== hash) {
            return next(createError(400, "Invalid password. Please try again."));
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        };
        console.log("User session data:", req.session.user);

        res.status(200).json({
            success: true,
            message: "Login successful!",
            messageType: "success",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            },
        });
    },
};
