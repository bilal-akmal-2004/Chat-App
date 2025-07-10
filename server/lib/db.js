import mongoose from "mongoose";

// funct to connect with the mongodb  db
export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database is connected.");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};
