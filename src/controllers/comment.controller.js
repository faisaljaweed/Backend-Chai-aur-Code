import { asynchandler } from "../utils/asynchandler.js";
// get Videos comments
// add comment
// delete comment
// update comment

const getVideoComments = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asynchandler(async (req, res) => {});

const deleteComment = asynchandler(async (req, res) => {});

const updateComment = asynchandler(async (req, res) => {});

export { getVideoComments, addComment, deleteComment, updateComment };
