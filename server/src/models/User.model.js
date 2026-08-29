const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    role:{
        type:String,
        enum:["user","admin","seller"],
        default:"user"
    },
    avatar:{
        type:String,
        default:""
    },
    address:[
        {
            street:String,
            city:String,
            state:String,
            zipcode:String,
            country:String,
            isDefault:Boolean
        }
    ],
    phone:String,
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
},{
    timestamps:true
})

const User =  mongoose.model("User",userSchema);

module.exports = User

// Admin
//  │
//  ├── Manage users
//  ├── Manage sellers
//  ├── Manage categories
//  ├── Manage orders
//  ├── View products
//  ├── Suspend product
//  ├── Suspend seller
//  └── Platform management