import express from "express";
import postController from "../controllers/postControllers.js";

const router = express.Router();
router.get("/createPost", postController.getCreatePost);
router.post("/createPost", postController.createPost);
router.get("/posts", postController.getAllPosts);
router.get("/posts/:id", postController.getSinglePost);
router.get("/posts/:id/edit", postController.getEditPost);
router.put("/posts/:id/edit", postController.editPost);

router.delete("/posts/:id", postController.deletePost);

export default router;
