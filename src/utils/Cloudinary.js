import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) throw new Error("File is missing");

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error.message);
          throw error;
        }
        console.log("File uploaded successfully:", result.url);
        // Optionally handle any cleanup or response here
      }
    );

    // Pipe the file buffer into the Cloudinary upload stream
    streamifier.createReadStream(file.buffer).pipe(stream);
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};

export { uploadOnCloudinary };
