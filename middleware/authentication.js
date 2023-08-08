const jwt=require('jsonwebtoken');
const user=require('../models/userSchema')



const authentication=async(req,res,next)=>{

try {
        const token=req.cookies.jwtoken;
        const verifytoken=jwt.verify(token,ASHWANIKUMARSACHINKUMARDEVPARTHINDRESHKUMAR);

        const rootuser=await user.findOne({
            _id:verifytoken._id,"tokens.token":token
        });

        if(!rootuser) {
            throw new Error("user not found");
        }

        req.token=token;
        req.rootuser=rootuser;
        req.userId=rootuser._id;

        next();



} catch (err) {
    res.status(401).send('Unauthorized:no access');
    console.log(err);
}

}

module.exports=authentication;