const express=require('express')
const app=express();
const  mongoose=require('mongoose')
const bodyparser=require('body-parser')

const cookieParser=require('cookie-parser')

require('dotenv').config()

app.use(bodyparser.urlencoded({Extended:true}))
app.use(bodyparser.json())
app.use(cookieParser())

//////////////MODELS/////////////
const users=require('./models/user')
const brands=require('./models/brands')
const woods=require('./models/woods')


//////////////MIDDLEWARES///////
const auth=require("./middlewares/auth")
const admin=require("./middlewares/admin")

////////////DATABASE///////////////
mongoose.Promise=global.Promise
mongoose.connect(process.env.database,{useNewUrlParser:true,useUnifiedTopology: true })
///////////////////Login route/////////////
app.get('/login',(req,res)=>
{
    res.status(200).json({message:"succesfully login"})
})
//////////////////Auth Route/////////////
app.get('/user/auth',auth,(req,res)=>
{
    res.status(200).json({
        isAdmin:req.user.role===0 ? false:true,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        cart:req.user.cart

    })
})
////////////Logout route////////
app.get("/user/logout",auth,(req,res)=>
{
    users.findOneAndUpdate({_id:req.user._id},
    {token:''},(err,user)=>
    {
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true,
            message:"logged out successfully"})

    })
   
})
//===================================================
//         Brands post
//===================================================
app.post("/product/brand",auth,admin,(req,res)=>
{
    const brand=new brands(req.body)
    brand.save((err,brand)=>
    {
        if(err) return res.status(400).json({success:false,
        message:err})
        return res.status(200).json({succees:true,brand})
    })

})
//===================================================
//         Brands get
//===================================================
app.get("/product/brand",(req,res)=>
{
    brands.find({},(err,brands)=>
    {
        if(err) return res.status(400).json({succees:false})
        return res.status(200).json(brands)
    })
})
//===================================================
//         woods post
//===================================================
app.post("/product/wood",auth,admin,(req,res)=>
{
    const wood=new woods(req.body)
    wood.save((err,brand)=>
    {
        if(err) return res.status(400).json({success:false,
        message:err})
        return res.status(200).json({succees:true,wood})
    })

})
//===================================================
//         Brands get
//===================================================
app.get("/product/wood",(req,res)=>
{
    woods.find({},(err,woods)=>
    {
        if(err) return res.status(400).json({succees:false})
        return res.status(200).json(woods)
    })
})
///////////////////Register Route/////////
app.post('/register',(req,res)=>
{
    const user1=new users(req.body)
    user1.save((err,data)=>
    {
        if(err) return res.json({success:false,err})
        res.status(200).json({sucess:true,
        user:data})
    })
})
///////////////////////
app.post('/login',(req,res)=>
{
    //finding user with given email
    users.findOne({"email":req.body.email},(err,user)=>
    {
        //no user found
        if(!user) return res.json({login:"failed",message:"No email found"})
        //user found check password
        user.comparePassword(req.body.password,(err,isMatch)=>
        {
            //wrong password
            if(!isMatch) 
                return res.json({login:"failed",message:"password incorrect"})

            //correct password need to generate token
            user.generateToken((err,user)=>
            {
                if(err) return res.json({login:"failed",message:err})
                return res.cookie('w_auth',user.token).status(200).json({login:"login successful"})
            })
            
        })
        
    })
})


const port=process.env.PORT||3500
app.listen(port,()=>
{
    console.log("server started at ${'port'}" )
})