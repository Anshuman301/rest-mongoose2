const jwt = require('jsonwebtoken')
const User = require('../utils/db')
const auth = async(req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = await jwt.verify(token,'thisismynewcourse')
        const user = await User.findOne({_id:decode._id,'tokens.token':token})
        if(!user)
        throw new Error()
        req.token = token
        req.user = user
        next();
    }catch(e){
        res.status(404).send({error:"error in Authentication"})
    }
}

module.exports = auth