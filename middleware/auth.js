const AdminAuth =  (req, res, next)=>{
    const token = "xyz";
    const adminAuthenticate = token ===  "xyz";
    if(!adminAuthenticate){
       res.status(401).send("Unauthorised Admin");
    }
    else{
       next();
    }
}

const userAuth =  (req, res, next)=>{
    const token = "xyz";
    const userAuthenticate = token ===  "xyz";
    if(!userAuthenticate){
       res.status(401).send("Unauthorised user");
    }
    else{
       next();
    }
}

module.exports = {AdminAuth, userAuth}