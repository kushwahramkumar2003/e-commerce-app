import { Router } from "express";

import {
  getProfile,
  login,
  logout,
  signUp,
} from "../controllers/auth.controller";

import { authorize, isLoggedIn } from "../middlewares/auth.middleware";
import AuthRoles from "../utils/authRoles";
const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

router.get("/profile", isLoggedIn, authorize(AuthRoles.ADMIN), getProfile);





export default router;
