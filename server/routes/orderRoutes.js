const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Protected routes (any logged-in user)
router.route("/").post(protect, createOrder);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);

// Admin only routes
router.route("/").get(protect, isAdmin, getAllOrders);
router.route("/:id/status").put(protect, isAdmin, updateOrderStatus);

module.exports = router;
