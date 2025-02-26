const mongoose = require("mongoose");
const validator = require("validator");
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
        if(!validator.isStrongPassword(value)){
             throw new Error("Enter a Strong Password");
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
module.exports = mongoose.model("User", userSchema);
