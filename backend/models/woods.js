const mongoose=require('mongoose')
const woodSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:1
    },
    

})
const woods=mongoose.model('woods',woodSchema)
module.exports=woods