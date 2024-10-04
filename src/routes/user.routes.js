import { Router } from "express";
import {
  loginUser,
  logOutUser,
  refresAccesshToken,
  registerUser,
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
export default router;
