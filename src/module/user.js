const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      alias: "name",
    },
    lastName: {
      type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,  
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error("Email is inValid")
            }
          }  
      },    
  
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
             throw new Error("Enter a Strong Password");
        }
      }  
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender Data is not Valid");
        }
      },
    },
    
    photoUrl: {
      type: String,
      default : "https://th.bing.com/th/id/OIP.eDfds46iXzl6qTA5yVkRJAHaHG?rs=1&pid=ImgDetMain",
      validate(value){
        if(!validator.isURL(value)){
             throw new Error("URL is not Valid");
        }
      } 
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      default: "Not provided the skills",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function(){
  const user = this; 
  const token =  await jwt.sign({_id : user._id}, "devTender740");
  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const passwordHash = this.password;
  const isPasswordValid =  await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
