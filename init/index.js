import 'dotenv/config';
import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const mapToken = process.env.MAP_TOKEN;
let geocodingClient = null;
if (mapToken) {
  geocodingClient = mbxGeocoding({ accessToken: mapToken });
} else {
  console.warn('MAP_TOKEN is not set. Seeder will skip Mapbox geocoding and use fallback coordinates.');
}

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

// Initialize database with sample data. Geocode entries that lack geometry.
const initDB = async () => {
  await Listing.deleteMany({});
  const docs = [];
  for (const obj of initData) {
    const copy = { ...obj };
    // If geometry missing or invalid, try geocoding via Mapbox
    if (!copy.geometry || !Array.isArray(copy.geometry.coordinates) || copy.geometry.coordinates.length !== 2) {
      if (mapToken) {
        try {
          const res = await geocodingClient.forwardGeocode({ query: copy.location, limit: 1 }).send();
          if (res && res.body && res.body.features && res.body.features.length > 0) {
            copy.geometry = res.body.features[0].geometry;
            console.log(`Geocoded ${copy.location} ->`, copy.geometry.coordinates);
          } else {
            console.warn(`No geocoding result for ${copy.location}, setting fallback [0,0]`);
            copy.geometry = { type: 'Point', coordinates: [0, 0] };
          }
        } catch (e) {
          console.warn(`Geocoding failed for ${copy.location}:`, e.message || e);
          copy.geometry = { type: 'Point', coordinates: [0, 0] };
        }
      } else {
        console.warn('MAP_TOKEN not set; setting fallback geometry [0,0] for', copy.location);
        copy.geometry = { type: 'Point', coordinates: [0, 0] };
      }
    }
    docs.push({ ...copy, owner: "69492bc6e4259bd4bc0c7c71" });
  }
  await Listing.insertMany(docs);
  console.log("data was initialized with", docs.length, "documents");
};

initDB();