const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../module/user");
const authRouter = express.Router();
const {validatSignUpData} = require("../utils/validation");
const jwt = require("jsonwebtoken");
authRouter.post("/signUp", async (req, res) => {
  try {
    // validate the data
    validatSignUpData(req)
    const { firstName, lastName, email, password, skills, age, gender, about} = req.body;
    // Encrypt the Password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });

    //  then Store it into the dataBase
    const savedUser = await user.save();

    const token = await savedUser.getJwt();
    res.cookie("token", token, { expires: new Date(Date.now() + 900000), httpOnly : true});
    
    res.status(201).json({message : "data is added successfully....", data : savedUser});
  } catch (error) {
    res.status(400).send("Invalid Request " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
  
      if (!user) {
        throw new Error("Invalid Credentials");
      }
  
      const isPasswordValid = await user.validatePassword(password);
  
      if (!isPasswordValid) {
        res.status(400).send("Invalid Credentials");
      }
       else {
        const token = await user.getJwt();
        res.cookie("token", token,{ expires: new Date(Date.now() + 900000), httpOnly: true });
        res.json(user);
      }
    } 
    catch (error) {
      res.status(400).send("Invalid Request");
    }
  });

authRouter.post("/logout", async(req, res)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  res.status(200).send("logout Successfully");
})

module.exports = authRouter;