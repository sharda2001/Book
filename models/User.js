const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true

    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    CreatedBy: {
        type: String
    }
});

module.exports= mongoose.model("user",userSchema)