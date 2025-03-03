import express from "express"
import session from 'express-session';
import path from "path"
import router from "./routers/index.js"
import morgan from "morgan"
import dotenv from 'dotenv';
dotenv.config();


const app = express()

app.use(express.json())
app.use(morgan('combined'));


const PORT = 3000

const publicPath = path.resolve("public")
const viewsPath = path.resolve("views")
app.use(session({
    secret: 'ukuleke',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(publicPath))
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", viewsPath);

app.use(router)

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})