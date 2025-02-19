const express = require('express');

const app = express();

const { AdminAuth, userAuth } = require('../middleware/auth');

app.use("/admin", AdminAuth)

app. get("/adminGetAllData",(req, res)=>{
   res.send("All data is sent successfully");
})

app.delete("/deleteData", (req, res)=>{
    res.send("data is deleted");
})

app.use("/user/data" ,userAuth, (req,res, next)=>{
   res.send("User Data")
})

app.use("/user/login" , (req, res)=>{
   res.send("logged successfully");
})

app.listen(7777,()=>{
    console.log("Server is listining successfully on port 7777")
})