const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required : true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        lowercase:true,
        required : true,
        unique:true,
        trim : true
    },
    password:{
        type:String,
        required : true
    },
    age:{
       type:Number,
       min:18
    },
    gender:{
       type:String,
       validate(value){
        if(!(["male","female","other"]).includes(value)){
            throw new Error("You entered invalid gender");
        }
       }
    },
    skills: {
        type: [String],
        default : "Not provided the skills"
      },
    },
    { timestamps: true })
module.exports = mongoose.model('User', userSchema);
