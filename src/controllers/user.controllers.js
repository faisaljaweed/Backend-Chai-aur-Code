import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refrsh and access token"
    );
  }
};

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
    throw new ApiError(400, "Invalid email form at");
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

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0 // <-- Typo here
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload to cloudinary
  // console.log("Uploading avatar to Cloudinary...");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // console.log("Avatar upload result:", avatar);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  //create user object - create entry in db

  const user = await User.create({
    fullname,
    avatar: avatar?.url || null,
    coverImage: coverImage?.url || null,
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response
  // password and refreshToken save in database but secure save
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

const loginUser = asynchandler(async (req, res) => {
  // user email and password from frontend
  // check Validate email and password
  // find the user
  //access and refresh token
  //send cookie
  //respose login

  // user email and password

  const { email, password, username } = req.body;
  console.log(email);

  // check username and password

  if (!(username && !email)) {
    if (!username || !email) {
      throw new ApiError(400, "Username and Password is required");
    }
  }

  // check username and email is same in database

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "Usser does not exists");
  }

  //

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentails");
  }
  console.log(`Successfully ${isPasswordValid}`);

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // ye options jb dete hain tw server se ye modified
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refresh", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User LoggedInSuccessfully"
      )
    );
});

const logOutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refresAccesshToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Uauthorized Request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired and or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessandRefreshToken(user._id);

    return res
      .status(200)
      .cookies("accessToken", accessToken, options)
      .cookies("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newrefreshToken },
          "Access Token Successfully "
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "old Password");
  }
  user.password = newPassword;

  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetch successfully"));
});

const updateAccountDetails = asynchandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "all fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullname, email },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account detaisl updated Successfully"));
});

const updateAvatar = asynchandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is missing ");
  }

  //delete old avatar image
  const oldAvatar = await User.findById(req.user?._id).select("avatar");
  const oldAvatarUrl = oldAvatar.avatar?.url;
  if (oldAvatarUrl) {
    await cloudinary.uploader.destroy(oldAvatarUrl.split("/")[7]); // Extract the public ID from the URL
  }

  // const oldAvatar = await User.findById(req.user?._id).select("avatar");
  // const oldAvatarUrl = oldAvatar.avatar?.url;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading Avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  // if (oldAvatarUrl && oldAvatarUrl !== avatar.url) {
  //   await cloudinary.uploader.destroy(oldAvatarUrl.split("/")[7]); // Extract the public ID from the URL
  // }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated Successfully"));
});

const updateCoverImage = asynchandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage is missing ");
  }

  //delete old cover image
  const oldCoverImage = await User.findById(req.user?._id).select("coverImage");
  const oldCoverImageUrl = oldCoverImage.coverImage?.url;
  if (oldCoverImageUrl) {
    await cloudinary.uploader.destroy(oldCoverImageUrl.split("/")[7]); // Extract the public ID from the URL
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading CoverImage");
  }

  const user = await User.findByIdAndUpdate(
    req.used?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated Successfully"));
});

const getUserChannelProfile = asynchandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "username is required");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
      $lookup: {
        from: "subscribtions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscribtions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribeCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribeCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exists");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel fetched Successfully")
    );
});

const getWatchHistory = asynchandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        // create a mongoose new id form the user id
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
      $lookup: {
        from: "videos",
        localField: "watchhistory",
        foreignField: "_id",
        as: "watchhistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchhistory,
        "Watch History fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refresAccesshToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
