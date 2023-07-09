const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        requied: true,
      },
    email: {
        type: String,
        requied: true,
      },
    phone: {
        type: String,
        requied: true,
      },
    image: {
        type: String,
        requied: true,
      },
    created:{
        type: Date,
        require:true,
        default: Date.now,
    },
})

module.exports=mongoose.model('User',userSchema);