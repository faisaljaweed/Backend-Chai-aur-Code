import Router from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  getVideoComments,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.route("/add-comment/:videoId").post(VerifyJWT, addComment);
router.route("/get-comments/:videoId").get(VerifyJWT, getVideoComments);
router.route("/delete-comment/:commentId").delete(VerifyJWT, deleteComment);
router.route("/update-comment/:commentId").patch(VerifyJWT, updateComment);
export default router;
