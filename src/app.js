const express = require('express');

const app = express();
// this will handle oly get Call to /user
app.get('/user', (req, res) => {
    console.log(req.params);
    res.send({"firstName" : "Sarveshwar" , "LastName" : "Shukla"});
});

app.post('/user', (req, res)=>{
    // data is stpring on the database
      res.send("data is stored successfully to the database");
})

app.delete('/user',(req, res)=>{
    res.send("Data Deleted from the database")
})
app.use('/test',(req, res)=>{
    res.send("hello ji kaise ho aap sab")
})

// this will handle all the upcoming request like get post delete patch every request wild card match '/'
// app.use('/',(req, res)=>{
//      res.send("hello ji i am the sarveshwar")
// })

app.listen(7777, ()=>{
    console.log("Server is connected successfully")
});