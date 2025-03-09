import createError from "http-errors";
import fs from "fs/promises";
import helpers from "../utils/helpers.js";
import moment from 'moment';

const usersFile = "./public/users/userinfo.json";

export default {
    getLogin: async (req, res) => {
        res.render("login", {title: "Login"});
    },

    login: async (req, res, next) => {
        const {email, password} = req.body;

        let users = [];
        try {
            const data = await fs.readFile(usersFile, "utf8");
            users = JSON.parse(data);
        } catch (err) {
            console.error("Error reading users file:", err);
            return next(createError(500, "Server error. Please try again later."));
        }

        const user = users.find((user) => user.email === email);
        if (!user) {
            return res.status(422).json({
                message: "User not found",
                success: false,
                messageType: "error",
            });
        }

        if (user.password !== helpers.passwordHash(password)) {
            return res.status(401).json({
                success: false,
                messageType: "error",
                message: "Wrong password",
            });
        }

        try {
            const expiresIn = moment().add(10, "minutes").toISOString();
            const token = helpers.encrypt({userId: user.id, expiresIn});

            return res.status(200).json({
                success: true,
                message: "Login successful!",
                messageType: "success",
                token,
                expiresIn,
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Encryption error:", error);
            return next(createError(500, "Token generation failed."));
        }
    },
};
