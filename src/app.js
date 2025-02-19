const express = require('express');

const app = express();

app.use("/user" , (req,res, next)=>{
   console.log("Handling the route user 01");;
//    res.send("1st Response")
   next();
},
 (req, res, next)=>{
    console.log("Handling the route user 02");
    // res.send("2nd Response")
    next();
},
 (req, res,next)=>{
    console.log("handling the route user 3rd");
    // res.send("3rd Response")
    next();
},
 (req, res, next)=>{
    console.log("handling the route user 4th");
    res.send("4th Response");
    next();
})

app.listen(7777,()=>{
    console.log("Server is listining successfully on port 7777")
})