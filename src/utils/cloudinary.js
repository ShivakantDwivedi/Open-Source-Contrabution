import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Ensure environment variables are properly configured
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

// Configure Cloudinary
cloudinary.config(cloudinaryConfig);

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    // Upload the file to Cloudinary
    //console.log('Uploading file to Cloudinary');
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully
   // console.log("File uploaded successfully to Cloudinary:", response.url);

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Handle errors
    console.error('Error occurred during Cloudinary upload:', error);
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return null;
  }
};

export { uploadOnCloudinary };
