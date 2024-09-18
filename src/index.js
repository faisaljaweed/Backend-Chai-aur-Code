import dontenv from "dotenv";
import connectDB from "./db/database.js";
import { app } from "./app.js";
dontenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection failed ${err}`);
  });

// import express from "express";

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MongoDb_URI}/${DBName}`);
//     console.log("database connected");
//     app.on("error", (error) => {
//       console.log("Err", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App islistening on ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// })();
