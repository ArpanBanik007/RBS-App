import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath, folder = "posts") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
      timeout: 60000, // ✅ 60 sec timeout
    });

    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }

    return null;
  }
};

 export { uploadOnCloudinary };




