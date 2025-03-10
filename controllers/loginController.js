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
        const {userId, password, email} = req.body;

        let users = [];
        try {
            const data = await fs.readFile(usersFile, "utf8");
            users = JSON.parse(data);
        } catch (err) {
            console.error("Error reading users file:", err);
            return next(createError(500, "Server error. Please try again later."));
        }

        const ifExist = users.find((user) => user.email === email);
        if (!ifExist) {
            res.status(422).json({
                message: "User not found",
                success: false,
                messageType: "error",
            });
            return;
        }

        if (ifExist.password === helpers.passwordHash(password)) {
            const expiresIn = moment().add(10, "minutes").toISOString();
            const token = helpers.encrypt({
                userId: ifExist.id,
                expiresIn,
            });
             res.status(200).json({
                 token: token,
                 expiresIn,
                success: true,
                message: "Login successful!",
                messageType: "success",
                 userId: ifExist.id


            });
             return

        }




        return res.status(401).json({
            success: false,
            messageType: "error",
            message: "Wrong password",
        });
    },
};
