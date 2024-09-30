import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    //upload the file on Coludniary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });

    //file has been uploaded Successfully
    // console.log("File is Uploaded on Cloudinary", response.url);
    fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); //remove the locally saved temporary file as the upload operation get field
    return null;
  }
};

export { uploadOnCloudinary };
