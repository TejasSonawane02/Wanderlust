import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connection to MongoDB successful");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

main();

// Initialize database with sample data
const initDB = async () => {
  await Listing.deleteMany({});
  const docs = initData.map((obj) => ({ ...obj, owner: "694301245540ba1b9bf8d7f6" }));
  await Listing.insertMany(docs);
  console.log("data was initialized");
};

initDB();