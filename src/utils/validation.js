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
const validateEditRequest =  (req)=>{
  const allowed_update = [
   "firstName",
   "lastName",
   "gender",
   "about",
   "skills"
  ]
  const isValidate =  Object.keys(req.body).every(key=>allowed_update.includes(key));
  return isValidate;
}

module.exports = {validatSignUpData, validateEditRequest};