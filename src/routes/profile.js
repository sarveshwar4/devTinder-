const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const { validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Invalid Request " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;
    const isValidate = validateEditProfileData(req);
    
    if (!isValidate) {
      throw new Error("update data is Invalid");
    }

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
   await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, profile Updated Successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Invalid Request " + error.message);
  }
});

profileRouter.patch("/profile/password/edit",userAuth, async(req, res)=>{
  try{
  const user = req.user;
  const {prevPassword, currPassword} = req.body;
  const isValid = await user.validatePassword(prevPassword);
  if(!isValid){
    throw new Error("you entering the wrong passwod firstly write correct the prev password");
  }
  const CurrenthashPassword = await bcrypt.hash(currPassword, 10);
  user.password = CurrenthashPassword;
  await user.save();
  res.send("password is updated successfully");
}
catch(error){
  res.status(400).send("ERROR:" + error.message)
}
});

module.exports = profileRouter;
