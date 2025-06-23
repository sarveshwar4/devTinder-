const validator = require("validator");

const validatSignUpData = (req)=>{
     const {firstName, lastName, email, password} = req.body;
     if(!firstName || !lastName){
        throw new Error("name is not Valid");
     }
     if(!validator.isEmail(email)){
       throw new Error("email is not valid");
     }
     if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid");
     }
}
const validateEditProfileData = (req)=>{
  
  const allowedEditField = [
   "firstName",
   "lastName",
   "gender",
   "about",
   "skills",
   "photoUrl",
   "age"
  ]
  const isValidate =  Object.keys(req.body).every(key=>allowedEditField.includes(key));
  return isValidate;
}

module.exports = {validatSignUpData, validateEditProfileData};