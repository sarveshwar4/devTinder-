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

module.exports = {validatSignUpData};