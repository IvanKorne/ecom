const mongoose = require("mongoose");

// Track connection status
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) return console.log("UNDEFINED");

  if (isConnected) return console.log("Using existing connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
