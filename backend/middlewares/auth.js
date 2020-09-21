const users=require('./../models/user.js')
let auth=(req,res,next)=>
{
 users.Verify(req.cookies.w_auth,(err,user)=>
 {
     if(err) throw err
     if(!user) 
     res.status(400).json({auth:false,message:"auth failed"})
     req.token=req.cookies.w_auth
     req.user=user
     next()
 })

}
module.exports=auth