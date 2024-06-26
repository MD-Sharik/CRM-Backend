import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new Error("Local file path is missing");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully:", response.url);

    // Delete local file after successful upload
    try {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted successfully");
    } catch (error) {
      console.error("Error deleting local file:", error.message);
    }
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);

    // Delete local file in case of error during upload
    try {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted due to upload error");
    } catch (unlinkError) {
      console.error("Error deleting local file:", unlinkError);
    }

    throw error;
  }
};

export { uploadOnCloudinary };
