const jwt = require("jsonwebtoken");
const User = require("../module/user");
const cookie = require("cookie");

const socketAuth = async (socket, next) => {
    const rawCookies = socket.handshake.headers?.cookie;
    let parsedCookies;
    try {
      parsedCookies = cookie.parse(rawCookies);
    } catch (err) {
      console.log("Cookie parse error:", err.message);
      return next(new Error("Authentication error: Invalid cookie format"));
    }
    const token = parsedCookies.token;
    let userId;
    try {
      const result = jwt.verify(token, "devTender740");
      userId = result._id;
    } catch (error) {
      console.log("JWT verification error:", error.message);
      return next(new Error("Authentication error: Invalid token"));
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log("User not found for ID:", userId);
        return next(new Error("Authentication error: User not found"));
      }
      socket.userId = userId;
      socket.user = user;
      next();
    } catch (error) {
      console.log("Error fetching user:", err.message);
      return next(new Error("Authentication error: Internal error"));
    }
  }
module.exports = socketAuth;