import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
// get all video get
// Publish/ Add video post
// delete video delete
// update video put
// get Video by id get
// toggle publish Status

const getAllVIdeos = asynchandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const publishAVideo = asynchandler(async (req, res) => {
  const { title, description, duration } = req.body;
  // if (!(title, description, req.files)) {
  //   throw new ApiError(402, "title, description and video files are requires");
  // }
  if (!title) {
    throw new ApiError(402, "Title is required");
  }
  if (!description) {
    throw new ApiError(402, "Description is required");
  }
  if (!req.files) {
    throw new ApiError(402, "Video is required");
  }

  if (!req.files.videofile || req.files.videofile === 0) {
    throw new ApiError(402, "Video is Already Exists");
  }

  if (!req.files.thumbnail) {
    throw new ApiError(401, "Thumbnail is requird");
  }

  const videolocalfile = req.files.videofile[0].path;
  const thumbnaillocalfile = req.files.thumbnail[0].path;

  if (!videolocalfile) {
    throw new ApiError(401, "video local is required");
  }

  if (!thumbnaillocalfile) {
    throw new ApiError(401, "video local is required");
  }
  const videofile = await uploadOnCloudinary(videolocalfile);
  const thumbnail = await uploadOnCloudinary(thumbnaillocalfile);
  if (!videofile) {
    throw new ApiError(401, "video is missing in cloudanry");
  }
  if (!thumbnail) {
    throw new ApiError(401, "thumbnail is missing in cloudinary");
  }

  const newVideo = await Video.create({
    videofile: videofile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: Number(duration),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video Succesfully upload"));
});

const getVideobyId = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Video is is not valid");
  }
  const getVideo = await Video.findById(videoId).populate("owner", "name");
  if (!getVideo) {
    throw new ApiError(401, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, getVideo, "video fetched successfully"));
});

const updateVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Video id is not Valid");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(401, "Video not found");
  }

  const { title, description, thumbnail, videofile } = req.body;

  if (title) {
    video.title = title;
  }
  if (description) {
    video.description = description;
  }
  if (thumbnail) {
    video.thumbnail = thumbnail;
  }
  if (videofile) {
    video.videofile = videofile;
  }
  await video.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Update Successfully"));
});

const deleteVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "video id is not valid");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(401, "Video not found");
  }
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Successfully Deleted"));
});

const togglePublishStatus = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { ispublished } = req.body;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "this video id is not valid");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(401, "Video not found");
  }
  video.ispublished = ispublished;
  await video.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `video published status updated to ${video.ispublished ? "published" : "unpublished"}`
      )
    );
});

export {
  getAllVIdeos,
  publishAVideo,
  getVideobyId,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

//670f9b79ec05d58aaf945572
