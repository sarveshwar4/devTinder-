const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
app.use(express.json());

// all request is parsing from this.... so the cookie can we access that is coming from the user side otherwise it gives undefind
// if i am not passing through this middleware so it shows undefined this is the reason why we are installing this npm library
app.use(cookiesParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
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