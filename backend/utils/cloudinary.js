import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || ""
});

export async function uploadImage(dataUri, folder = "lost-found") {
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary API key not configured");
  }
  return cloudinary.uploader.upload(dataUri, { folder, resource_type: "image" });
}
