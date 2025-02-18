const express = require('express');

const app = express();

app.use((req, res)=>{
     res.end("hello ji i am the sarveshwar")
})

app.use('/hello',(req, res)=>{
    res.end("hello ji")
})

app.use('/test',(req, res)=>{
    res.end("hello ji kaise ho aap sab")
})

app.listen(7777);