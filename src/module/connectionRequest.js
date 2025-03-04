const mongoose  = require("mongoose");
const connectionRequestSchema = mongoose.Schema({
    fromUserId : {
        type : String,
        required : true,
    },
    toUserId : {
        type : String,
        required : true,
    },
    status :{
        type : String,
        validate(value){
            if(!['interested', 'ignored', 'accepted', 'rejected'].includes(value)){
                throw new Error('Enter the correct Status Type');
            }
        }
    }
})
module.exports = mongoose.model('connectionRequest', connectionRequestSchema);
