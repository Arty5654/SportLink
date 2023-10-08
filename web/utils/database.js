import mongoose from "mongoose";

let isConnected = false; // track connectioni status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sportlinkdb",
      useNewUrlParer: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
