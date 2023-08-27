import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../service/asyncHandler";
import razorpay from "../config/razorpay.config.js";
import CustomError from "../utils/CustomError";

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;

  if (!products || products.length == 0) {
    throw new CustomError("No product found", 400);
  }

  let totalAmount = 0;
  let discountAmount = 0;

  //Do product calculation based on DB calls

  let productPriceCal = Promise.all(
    products.map(async (product) => {
      const { productId, count } = product;
      const productFromDB = await Product.findById(productId);
      if (!productFromDB) {
        throw new CustomError("No product found", 400);
      }
      if (productFromDB.stock < count) {
        return res.status(400).json({
          success: false,
          error: "Product quantity not in stock",
        });
      }
      totalAmount += productFromDB.price * count;
    })
  );
  await productPriceCal;

  //TODO : check for coupon discount if applicable

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime()}`,
  };

  const order = await razorpay.orders.create(options);
  if (!order) {
    throw new CustomError("Unable to generate order", 400);
  }

  res.status(200).json({
    success: true,
    message: "Razorpay order id generated successfully",
  });
});

// TODO: add order in database and update product stock

export const generateOrder = asyncHandler(async (req, res) => {
  //add more fields below
  const { transectionId, products, coupon } = req.body;
});

// Todo : get only my orders

export const getMyOrders = asyncHandler(async (req, res) => {});

// Todo : get all my orders: Admin

export const getAllOrders = asyncHandler(async (req, res) => {
  //
});

// Todo : update order Status : Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  //
});
