import Router from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  publishAVideo,
  getVideobyId,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.conroller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/publish-Video").post(
  upload.fields([
    {
      name: "videofile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  VerifyJWT,
  publishAVideo
);
router.route("/get-video/:videoId").get(VerifyJWT, getVideobyId);
router.route("/update-video/:videoId").patch(VerifyJWT, updateVideo);
router.route("/delete-video/:videoId").delete(VerifyJWT, deleteVideo);
router
  .route("/tooglePublishStatus/:videoId")
  .patch(VerifyJWT, togglePublishStatus);
export default router;
