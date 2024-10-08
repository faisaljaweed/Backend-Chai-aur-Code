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

app.use(express.json({ limit: "10mb" }));

//jb url se data aye tw ye wala app .use chale ga

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//file or folder imgae aye ga tw public mai aye ga

app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import commentsRouter from "./routes/comments.routes.js";
import tweetsRouter from "./routes/tweets.routes.js";
import likesRouter from "./routes/likes.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscribeRouter from "./routes/subscription.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/tweets", tweetsRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/vi/subscribe", subscribeRouter);
app.use("/api/vi/playlist", playlistRouter);

export { app };
