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
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };
const User =  new mongoose.model("User",userSchema);

module.exports = User