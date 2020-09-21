const mongoose=require('mongoose')
const brandSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:1
    }
 
})
const brands=mongoose.model('brands',brandSchema)
module.exports=brands