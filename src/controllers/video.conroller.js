import { asynchandler } from "../utils/asynchandler.js";
// get all video get
// create video post
// delete video delete
// update video put
//get Video by id get
// toggle publish Status

const getAllVIdeos = asynchandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const publishAVideo = asynchandler(async (req, res) => {
  const { title, description } = req.body;
});

const getVideobyId = asynchandler(async (req, res) => {
  const { videoId } = req.params;
});

const updateVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;
});

const deleteVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;
});

const togglePublishStatus = asynchandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVIdeos,
  publishAVideo,
  getVideobyId,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
