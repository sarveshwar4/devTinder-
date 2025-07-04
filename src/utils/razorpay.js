const Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: process.env.RAZARPAY_KEY_ID,
  key_secret: process.env.RAZARPAY_SECRET_KEY,
});

module.exports = instance;