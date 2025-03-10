import express from "express"

import path from "path"
import router from "./routers/index.js"
import morgan from "morgan"
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";

dotenv.config();

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express()

app.use(express.json())
app.use(morgan('dev'));

app.use(cookieParser());

const PORT = 3000

const publicPath = path.resolve("public")
const viewsPath = path.resolve("views")


app.use(express.static(publicPath))
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", viewsPath);

app.use(router)

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})