import { Router } from "express";

import {
  forgotPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  signUp,
} from "../controllers/auth.controller";

import { authorize, isLoggedIn } from "../middlewares/auth.middleware";
import AuthRoles from "../utils/authRoles";
const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/password/forgot/", forgotPassword);
router.post("/password/reset/:token", resetPassword);

router.get("/profile", isLoggedIn, authorize(AuthRoles.ADMIN), getProfile);

export default router;
