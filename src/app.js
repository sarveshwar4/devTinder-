const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const { PORT } = require("./config/serverConfig");
const cors = require("cors");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
// so the cors is used to allow the request from the different domain different port number
app.use(cors({
  origin: "http://16.171.255.250",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("API is working ✅");
});


initializeSocket(server);
app.use(express.json());

// all request is parsing from this.... so the cookie can we access that is coming from the user side otherwise it gives undefind
// if i am not passing through this middleware so it shows undefined this is the reason why we are installing this npm library
app.use(cookiesParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use('/', chatRouter);
connectDB()
  .then(() => {
    console.log("database is connected to server is successfully");
    server.listen(PORT, () => {
      console.log(`Server is listining successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DataBase not Established");
  });


    // origin:"http://localhost:5173",