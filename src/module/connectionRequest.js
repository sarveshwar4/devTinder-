const e = require("express");
const mongoose  = require("mongoose");
const connectionRequestSchema = mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    status :{
        type : String,
        required : true,
        enum : {
            values : ['interested', 'ignored', 'accepted', 'rejected'],
            message : `{VALUE} is incorrect status type`
        }
    }  
}, 
 {timestamps : true}
);

connectionRequestSchema.pre("save", async function(next){
    const request = this;
    const fromUserid = request.fromUserId;
    const toUserId = request.toUserId;
    if(fromUserid.equals(toUserId)){
        throw new Error("You can't send request to yourself");
    }
    next();
})

module.exports = mongoose.model('connectionRequest', connectionRequestSchema);
