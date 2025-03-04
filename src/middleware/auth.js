const jwt = require("jsonwebtoken");
const User = require("../module/user");
const userAuth = async (req, res, next) => {
  try {
    // Extract token from cookies
    const { token } = req.cookies;
   // Check if token is present
    if (!token) {
      throw new Error("token is not Valid");
    }
     // Verify token and decode data
    const decodedData = jwt.verify(token, "devTender740");
    const { _id } = decodedData;
    const user = await User.findById({_id});

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(404).send("ERROR:" + error.message);
  }
};

module.exports = { userAuth };
