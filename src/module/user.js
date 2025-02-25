const mongoose = require("mongoose");

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
      },      
    password: {
      type: String,
      required: true,
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
