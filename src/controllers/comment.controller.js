import { asynchandler } from "../utils/asynchandler.js";
import { Comment } from "../models/comments.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "mongoose";
// get Videos comments
// add comment
// delete comment
// update comment

const getVideoComments = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const aggregate = Comment.aggregate([
    {
      $match: {
        video: mongoose.Types.ObjectId(videoId),
      },
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
      $project: {
        content: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const options = {
    page,
    limit,
  };

  const comments = await Comment.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched Succesfully"));
});

const addComment = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(401, "Content is required");
  }
  const comment = await Comment.findById(videoId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });
  return res.status(200).json(200, newComment, "Comment added Succesfully");
});

const deleteComment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted Succesfully"));
});

const updateComment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(402, "Content is required");
  }

  const comment = await Comment.findByIdAndUpdate(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  comment.content = content;
  comment.save();

  return res.status(200).json(200, comment, "Comment updated Succesfully");
});

export { getVideoComments, addComment, deleteComment, updateComment };
