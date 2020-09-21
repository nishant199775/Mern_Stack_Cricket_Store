let admin=(req,res,next)=>
{
    if(req.user.role===0)
    res.status(400).send("you are not allowed coz u are not admin")
    next()
}
module.exports=admin