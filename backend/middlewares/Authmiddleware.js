var jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports.authMiddleware = async(req,res,next)=>{
    const {accessToken}=req.cookies
    console.log(req.cookies)

    if (!accessToken) {
        return res.status(409).json({error:"please Login first"})
        
    } else {
        try {

            const deCodeToken = await jwt.verify(accessToken,process.env.jt_SECRET)
           console.log(accessToken,"\n this is the access token")
            req.role = deCodeToken.role
            req.id = deCodeToken.id
            //console.log(req["id"])
            next()

        } catch (error) {
            return res.status(409).json({error:"please Login"})
        }
    }
}