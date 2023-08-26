import { Router } from "express";

import { authorize, isLoggedIn } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
const router = Router();

router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCoupon);
router.delete(
  "/:id",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  deleteCoupon
);
router.put(
  "/action/:id",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  updateCoupon
);
router.get(
  "/",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  getAllCoupons
);

export default router;
