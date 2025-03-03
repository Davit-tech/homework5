import fs from "fs/promises";
import createError from "http-errors";

const postsFile = "./public/posts/posts.json";

const title = "createPOst";
export default {
    getAllPosts: async (req, res, next) => {
        const title = "getAllPosts";
        let posts;
        try {
            const data = await fs.readFile(postsFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log(error);
            next(createError(500, "Error reading posts file"));
        }

        res.render("posts", {posts, title});
    },
    getSinglePost: async (req, res, next) => {
        const title = "getSinglePost";
        const {id} = req.params;

        let posts;
        try {
            const data = await fs.readFile(postsFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            return next(createError(500, "Error reading posts file"));
        }

        const post = posts.find((post) => post.id === id);
        if (post) {
            res.render("post", {post, title});
        } else {
            return next(createError(404, "Post not found"));
        }
    },
    getCreatePost: (req, res) => {
        res.render("createPost", {title});
    },
    createPost: async (req, res, next) => {
        const {title, author, text} = req.body;
        let posts = [];
        try {
            const data = await fs.readFile(postsFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            return next(createError(500, "Error reading posts file"));
        }

        const userId = req.session?.user?.id;
        const newPost = {id: userId, title, author, text};
        posts.push(newPost);
        try {
            await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), "utf8");
            res.redirect("posts");
        } catch (error) {
            console.error("Error saving post:", error);
            return next(createError(500, "Error saving post"));
        }
    },
    getEditPost: async (req, res, next) => {
        const {id} = req.params;

        let posts = [];
        try {
            const data = await fs.readFile(postsFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            return next(createError(500, "Error reading posts file"));
        }

        const post = posts.find((post) => post.id === id);
        if (post) {
            res.render("editPost", {post, title: "editPost"});
        } else {
            return next(createError(404, "Post not found"));
        }
    },
    editPost: async (req, res, next) => {
        const {id} = req.params;
        const {title, author, text} = req.body;

        let posts;
        try {
            const data = await fs.readFile(postsFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            return next(createError(500, "Error reading the file"));
        }

        const postIndex = posts.findIndex((post) => post.id === id);
        if (postIndex === -1) {
            return next(createError(404, "Post not found"));
        }

        posts[postIndex] = {...posts[postIndex], title, author, text};

        try {
            await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), "utf8");

            res.json({
                message: "Post updated successfully",
                post: posts[postIndex],
            });
        } catch (error) {
            console.error("Error saving the post:", error);
            return next(createError(500, "Error saving the post"));
        }
    },
    deletePost: async (req, res, next) => {
        const {id} = req.params;
        let posts;
        try {
            const data = await fs.readFile(postsFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log(error);
            return next(createError(500, "Error reading posts file"));
        }
        posts = posts.filter((post) => post.id !== id);
        try {
            await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), "utf8");
            res.status(204).end();
        } catch (error) {
            return next(createError(500, "Error deleting post"));
        }
    },
};
