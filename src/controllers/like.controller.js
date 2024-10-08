import { asynchandler } from "../utils/asynchandler.js";

// toggle like video
// toggle like comment
// toggle like tweet
// get liked videos

const toggleLikeVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;
});

const toggleLikeComment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
});

const toggleLikeTweet = asynchandler(async (req, res) => {
  const { tweetId } = req.params;
});

const getLikedVideos = asynchandler(async (req, res) => {});

export { toggleLikeVideo, toggleLikeComment, toggleLikeTweet, getLikedVideos };
