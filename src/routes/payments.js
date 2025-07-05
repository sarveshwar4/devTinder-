const express = require("express");
const paymentsRouter = express.Router();
const RazarpayInstance = require("../utils/razorpay");
const { userAuth } = require("../middleware/auth");
const Payments = require("../module/payment");
const MembershipType = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../module/user");

paymentsRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;
    const order = await RazarpayInstance.orders.create({
      amount: MembershipType[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType,
      },
    });
    const payment = await Payments.create({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayments = await payment.save();
    return res.status(201).json({
      data: savedPayments,
      message: "Order created successfully",
      success: true,
      error: {},
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res.status(500).json({
      data: {},
      message: "Failed to create payment order",
      success: false,
      error: error,
    });
  }
});

paymentsRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("x-razorpay-signature");
    const iswebhookSignatureValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZARPAY_WEBHOOK_SECRET);

    if (!iswebhookSignatureValid) {
      return res.status(400).json({
        message: "Invalid webhook signature",
        success: false,
      });
    }
    const paymentdetails = req.body.payload.payment.entity;
    const payment = await Payments.findOne({
      orderId: paymentdetails.order_id,
    });
    
    // Update the payment details in the database mark as captured or failed
    payment.status = paymentdetails.status;
    await payment.save();
    console.log("Payment details updated successfully");

    const user = await User.findById({_id:payment.userId});
    user.isPremium = true;
    user.membershipType = paymentdetails.notes.membershipType;
    await user.save();
    console.log("User membership updated successfully");
    //need to send response to razorpay
    return res.status(200).json({
      message: "Payment status updated successfully",
      success: true,
      data: payment,
    });
  } catch (error) {}
});


paymentsRouter.get("/payment/verify", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user.isPremium) {
      return res.status(200).json({
        message: "User is a premium member",
        success: true,
        data: {
          isPremium: user.isPremium,
          membershipType: user.membershipType,
        },
      });
    }

    return res.status(200).json({
      message: "User is not a premium member",
      success: true,
      data: {
        isPremium: false,
        membershipType: null,
      },
    });

  } catch (error) {
    console.error("Error verifying premium status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


module.exports = paymentsRouter;
