const mongoose = require('mongoose');
const url = "mongodb+srv://sarveshwarshukla:qxHH1EKOKIUTEIVR@sknode.pgrsp.mongodb.net/DevTender";
const connectDB = async()=>{
    await mongoose.connect(url);
}
module.exports = connectDB;