import { Router } from "express";

import {
  loginUser,
  logOutUser,
  refresAccesshToken,
  registerUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(VerifyJWT, logOutUser);
router.route("/refresh-token").post(refresAccesshToken);
router.route("/change-password").post(VerifyJWT, changeCurrentPassword);
router.route("/current-user").post(VerifyJWT, getCurrentUser);
router.route("/update-account").patch(VerifyJWT, updateAccountDetails);
router.route("/avatar").patch(VerifyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/coverImage")
  .patch(VerifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/c/:username").get(VerifyJWT, getUserChannelProfile);
router.route("/watch-history").get(VerifyJWT, getWatchHistory);
export default router;
