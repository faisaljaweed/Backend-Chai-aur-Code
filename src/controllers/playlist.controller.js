import { asynchandler } from "../utils/asynchandler.js";

// create playlist
// get User Playlists
// get playlist by id
// add video to playlist
// remove video from playlist
// delete playlist
// update playlist

const createPlaylist = asynchandler(async (req, res) => {
  const { name, description } = req.body;
});

const getUserPlaylists = asynchandler(async (req, res) => {
  const { userId } = req.params;
});

const getPlaylistById = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
});

const addVideoToPlaylist = asynchandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

const deletePlaylist = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
});

const updatePlaylist = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
