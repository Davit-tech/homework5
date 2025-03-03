import fs from "fs/promises";

const usersFile = "./public/users/userinfo.json";
import createError from "http-errors";

export default {
  getUsersListForEJS: async (req, res, next) => {
    let users = [];
    try {
      const data = await fs.readFile(usersFile, "utf8");
      users = JSON.parse(data);
    } catch (err) {
      return next(createError(500, "Server error"));
    }

    res.render("users", {
      title: "Users List",
      users,
      currentUser: req.session.user,
    });
  },

  getUserProfile: async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }
    const { email } = req.params;

    let users = [];
    try {
      const data = await fs.readFile(usersFile, "utf8");
      users = JSON.parse(data);
    } catch (err) {
      return next(createError(500, "Server error"));
    }

    const user = users.find((user) => user.email === email);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.render("userProfile", {
      user,
      title: "User Profile",
    });
  },
};
