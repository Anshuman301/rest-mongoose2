const mongoose =require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
mongoose.connect('mongodb+srv://Anshuman:6eAk1G9rFX9gTUBl@cluster0-7nrdg.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology:true,useNewUrlParser:true})

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value < 0)
            throw new Error('Age must not be negative')
        }
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('It Shoul be an email')
        }
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.toJSON = function (){
    const user = this.toObject()
    delete user.password
    delete user.tokens
    return user;
}
userSchema.methods.generateAuthToken = async function(){
    const user = this
        const token = await jwt.sign({_id:user._id.toString()},'thisismynewcourse')
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token;
}
userSchema.statics.findByCredentials = async (email,password) =>{
    try{
        const user = await User.findOne({email})
        if(!user)
        throw new Error()
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
            throw new Error()
        return user;
    }catch(e){
        return "Unable to login"
    }
}
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

const User = mongoose.model('User',userSchema)

module.exports = User


