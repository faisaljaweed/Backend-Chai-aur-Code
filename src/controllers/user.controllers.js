import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asynchandler(async (req, res) => {
  // get user details from frotends
  // validation -not empty
  // check if user already exists username, email
  // check for images, check for avatar
  // upload them to cloudinary
  //create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  //return res

  console.log("Request body", req.body);
  console.log("Request files", req.files);
  // get user details from frontends
  const { fullname, email, password, username } = req.body;
  // console.log("email:", email);

  // validation -not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!email.includes("@") || !email.includes(".")) {
    throw new ApiError(400, "Invalid email format");
  }

  // check if user already exists username, email

  const existsUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existsUser) {
    throw new ApiError(409, "User with email and username already exists");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload to cloudinary
  console.log("Uploading avatar to Cloudinary...");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("Avatar upload result:", avatar);

  let coverImage = null;
  if (coverImageLocalPath) {
    console.log("Uploading cover image to Cloudinary...");
    console.log("File path for cover image upload:", coverImageLocalPath);
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Cover image upload result:", coverImage);
  }

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //create user object - create entry in db

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering ther User");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));
});

export { registerUser };
