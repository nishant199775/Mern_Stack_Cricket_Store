const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const salt_i=10
const jwt=require('jsonwebtoken')
require('dotenv').config()

////////schema design
const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:1
    },
    password:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        maxLength:100,
        required:true
    },
    lastname:{
        type:String,
        maxLength:100,
        required:true
    },
    cart:{
        type:Array,
        default:[]
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:"no_token"
    }

})
//////decrypting password before posting it in db

userSchema.pre('save',function(next)
{
    var userRef=this;
    if(userRef.isModified('password'))
    {
        bcrypt.genSalt(salt_i,function(err,salt)
        {
            if(err) return next(err)

            bcrypt.hash(userRef.password,salt,function(err,hash)
            {
                if(err) return next(err)

                userRef.password=hash;
                next();
            })
        })
    }
    else return next();
    
})
///Schema Method-1 compare Password

userSchema.methods.comparePassword=function(userPassword,callback)
{
    bcrypt.compare(userPassword,this.password,function(err,isMatch)
    {
        if(err) return callback(err,false)
        return callback(null,isMatch)
    })

}
///Schema mehtod-2 generate token

userSchema.methods.generateToken=function(cb)
{
    var user=this;
    var token=jwt.sign(user._id.toHexString(),process.env.secret_key);
    user.token=token;
    user.save(function(err,user)
    {
        if(err) return cb(err)
        return cb(null,user)
    })
}
userSchema.statics.Verify=function(token,cb)
{
    var user=this;
    jwt.verify(token,process.env.secret_key,(err,decode)=>
    {
        user.findOne({"_id":decode,"token":token},(err,user)=>
        {
            if(err) return cb(err)
            return cb(null,user)
        })
    })
}

const user=mongoose.model('user',userSchema)
module.exports=user 