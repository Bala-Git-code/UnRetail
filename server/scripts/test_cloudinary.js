import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkCloudinary() {
  console.log("Pinging Cloudinary configuration...");
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? '••••' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Not Configured'}`);

  if (process.env.CLOUDINARY_API_KEY === '123456789012345' || !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET.includes('Secret')) {
    console.error("\n❌ Error: Your Cloudinary credentials in server/.env are still placeholders!");
    console.log("Please update server/.env with your real credentials from the Cloudinary Dashboard.");
    return;
  }

  try {
    // Attempt to list resource types as a simple API check
    const result = await cloudinary.api.ping();
    console.log("\n✅ Success: Cloudinary connection verified successfully!");
    console.log("Result:", result);
  } catch (error) {
    console.error("\n❌ Error: Cloudinary connection failed!");
    console.error("Details:", error.message || error);
  }
}

checkCloudinary();
