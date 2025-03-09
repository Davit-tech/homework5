import express from "express";
import postRouter from "./post.js";

const router = express.Router();
import userRouter from "./users.js";

const title = "home page";
router.use("/user", userRouter);
router.use("/post", postRouter);
router.get("/", (req, res) => {
  res.render("home", { title });
});

export default router;
