import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import Coupon from "../models/coupon.schema.js";

/****************************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created Successfully"
 *****************************************************************/

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = req.body;

  if (!code || !discount) {
    throw new CustomError("Code and discount are required", 400);
  }

  //check id code already exist

  const coupon = await Coupon.create({
    code,
    discount,
  });

  res.status(200).json({
    success: true,
    message: "Coupon created successfully",
  });
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const allCoupons = await Coupon.find();
  if (!allCoupons) {
    throw new CustomError("No coupons found", 404);
  }
  res.status(200).json({
    success: true,
    allCoupons,
  });
});

export const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    throw new CustomError("No coupon found", 404);
  }
  res.status(200).json({
    success: true,
    coupon,
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  const { action } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { active: action },
    { new: true, runValidators: true }
  );
  if (!coupon) {
    throw new CustomError("No coupon found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  const coupon = await Coupon.findByIdAndDelete(couponId);
  if (!coupon) {
    throw new CustomError("No coupon found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});
