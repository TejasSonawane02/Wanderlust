import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Allow full URL fallback (CLOUDINARY_URL) or explicit vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ url: process.env.CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });
}

// Validate presence of credentials and provide a clear error if missing
const missing = [];
if (!process.env.CLOUDINARY_URL) {
  if (!process.env.CLOUD_NAME) missing.push('CLOUD_NAME');
  if (!process.env.CLOUD_API_KEY) missing.push('CLOUD_API_KEY');
  if (!process.env.CLOUD_API_SECRET) missing.push('CLOUD_API_SECRET');
}
if (missing.length) {
  console.error(`Missing Cloudinary env vars: ${missing.join(', ')}. Set them or provide CLOUDINARY_URL.`);
  throw new Error('Missing Cloudinary configuration');
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_images',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

export { cloudinary, storage };