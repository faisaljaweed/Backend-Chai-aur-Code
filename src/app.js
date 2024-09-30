import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: process.env.CORS_ORIGIN,
  })
);

// jb form bharne ke pr jo data ata hai wo app.use me aayega

app.use(express.json({ limit: "20kb " }));

//jb url se data aye tw ye wala app .use chale ga

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

//file or folder imgae aye ga tw public mai aye ga

app.use(express.static("public"));

app.use(cookieParser());

import router from "./routes/user.routes.js";

app.use("/api/v1/users", router);

export { app };
