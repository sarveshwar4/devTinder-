const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./module/user");
const bcrypt = require("bcrypt");

// middleware for converting the upcoming json obj to js and save it to req body
app.use(express.json());

const { validatSignUpData } = require("./utils/validation");

app.post("/login",async(req, res)=>{
try{
const {email, password} = req.body;
const user = await User.findOne({email : email});
if(!user){
   throw new Error("Invalid Credentials");
}
const isPasswordValid = await bcrypt.compare(password, user.password);
if(!isPasswordValid){
   res.status(400).send("Invalid Credentials");
}
else{
  res.send("login Successfull");
}
}
catch (error) {
   res.status(400).send("Invalid Request " + error.message);
 }
})

// SignUp the user
app.post("/signUp", async (req, res) => {
  try {
   
    // validate the data
    validatSignUpData(req);
    
   // Encrypt the Password
   const {firstName,lastName,email,password,skills} = req.body;

   const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName, lastName, email, password:passwordHash , skills
    });

   //  then Store it into the dataBase
    await user.save();
    res.status(201).send("data is added successfully....");
  } catch (error) {
    res.status(400).send("Invalid Request " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.get("/user", async (req, res) => {
  try {
    const useremail = req.body.email;
    const data = await User.find({ email: useremail });
    console.log(data);
    if (data.length < 1) {
      res.status(400).send("something went Wrong");
    } else {
      res.status(201).send(data);
    }
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    //these are update the can do by user anytime
    const Allowed_Update = [
      "photoUrl",
      "about",
      "password",
      "age",
      "gender",
      "skills",
    ];

    //   if any of not match it return False
    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Update.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills may be outOfBound");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User Updated successfully...");
  } catch (error) {
    res.status(401).send("Invalind Something " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("database is connected to server is successfully");
    app.listen(7777, () => {
      console.log("Server is listining successfully on port 7777");
    });
  })
  .catch((err) => {
    console.error("DataBase not Established");
  });

// const userEmail = req.body.email;
//  const existingData = await User.findOne({email : userEmail});
//  if(existingData){
//     throw new Error("Email is alerady registered inside the DataBase")
//  }
