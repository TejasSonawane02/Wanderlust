import mongoose, { set } from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: {
    type: String,
    default: "https://unsplash.com/photos/brown-hut-near-body-of-water-oji_NGmBI5o",
        set: (v) => v === "" ? "https://unsplash.com/photos/brown-hut-near-body-of-water-oji_NGmBI5o" : v
    },
    price: { type: Number},
    location: { type: String,  },
    country: { type: String, },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;