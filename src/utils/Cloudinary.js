import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("File is missing");
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error.message);
            reject(error);
          } else {
            console.log("File uploaded successfully:", result.url);
            resolve(result);
          }
        }
      );

      // Pipe the file buffer into the Cloudinary upload stream
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};

export { uploadOnCloudinary };
