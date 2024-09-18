import mongoose from "mongoose";
import { DB_Name } from "../contants.js";

const ConnectDB = async () => {
  try {
    const connectioninstance = await mongoose.connect(
      `${process.env.MongoDb_URI}/${DB_Name}`
    );
    console.log(
      `MongoDB Connected || DB HOST ${connectioninstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection error", error);
    process.exit(1);
  }
};

export default ConnectDB;
