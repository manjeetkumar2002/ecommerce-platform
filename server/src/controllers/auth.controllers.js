const bcrypt = require("bcrypt");
const User = require("../models/User.model.js")
const validate = require("../utils/validate.js")
const genToken = require("../utils/genToken.js")
const crypto = require("crypto")
const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        // checking missing fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        // validating the data
        validate(email,password);
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        // hashing the password
        const hashedPassword = await bcrypt.hash(password,10);
        
        // storing user data 
        const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        
        // token generating
        const token = genToken(user);
        
        // storing token into cookie
        res.cookie("token", token, {
            httpOnly: true
        });
        
        // sending the response
        return res.status(201).json({
            message: "Registration successful",
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        // checking missing fields
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        // validating the data
        validate(email,password);
        // fetch the user 
        const user = await User.findOne({email:email});
       
        if(!user){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        // match the password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        // generate the token
        const token = genToken(user);

         res.cookie("token", token, {
            httpOnly: true
        });
        // sending the response
        return res.status(200).json({
            message: "Login successful",
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const logout = async(req,res)=>{
    try {
        const {token} = req.cookies
        if(!token){
            return res.status(400).json({
                message: "Token is not present"
            });
        }
        res.clearCookie('token').status(200).send('Logged out successfully');
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
// Jab user "Forgot Password" click karta hai:

// 1.User apna Email daalta hai.

// 2.Server ek Unique Token (Random string) generate karta hai aur usse Database mein User ke saath store karta hai (saath mein expiry time bhi).

// 3.Server user ke email par ek link bhejta hai (e.g., http://frontend.com/reset-password/:token).

// 4.User email mein link click karta hai -> Frontend par ek page khulta hai jahan user Naya Password daalta hai.

// 5.Frontend wo Naya Password + Token server ko bhejta hai.

// 6.Server check karta hai ki token valid hai aur expired toh nahi, agar sab sahi hai toh password update kar deta hai.
const forgetPassword = async(req,res)=>{
    try {
        const {email} = req.body
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(401).json({
                message: "user not found"
            });
        }
        // 1. Generate a random token
        const resetToken = crypto.randomBytes(20).toString("hex")
        // 2. Hash token and save in DB (security ke liye)
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex"),
        // 3. Expiry Time (10 minutes)
        user.resetPasswordExpire = Date.now() * 10*60*1000;
        await user.save({validateBeforeSave:false});
        // 4. send mail
        const resetUrl = `${process.env.VITE_FRONTEND_URL}/reset-password/${resetToken}`; // Ye frontend ka URL hai

        const message = `
            <h1>Reset Password</h1>
            <p>Click on the link to reset your password</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>This link is valid for 10 minutes.</p>
        `
        // Nodemailer config (Gmail etc.)
        const transporter = nodermailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD
            }
        })

        await transporter.sendMail({
            to:user.email,
            subject:"Reset Password",
            html:message
        })
        res.status(200).json({message:`Email sent to ${user.email}`});
    } catch (error) {
        // Agar email fail ho jaye toh DB se token hata do
        User.resetPasswordToken = undefined;
        User.resetPasswordExpire = undefined;
        await User.save({ validateBeforeSave: false });
        
        res.status(500).json({ message: error.message });
    }
}

//Jab user email se link click karega, toh frontend is API ko call karega with new password.
const resetPassword = async(req,res)=>{
    try {
        const token = req.params.token
        // 1. Token jo URL mein aaya hai, usko hash karo (kyunki DB mein hash store hai)
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        // 2. DB mein user find karo jiska token match ho aur expiry time abhi tak valid ho
        const user = await User.findOne({
            resetPasswordToken:resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}// $gt means greater than (expired nahi hona chahiye)
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or Expired Token" });
        }

        // 3. Naya password set karo (pehle hash karo bcrypt se)
        const salt = await bcrypt.salt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
         // 4. Token fields ko hata do (kyuki ab kaam ho gaya)
        user.password = hashedPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()

        res.status(200).json({message:"Password reset Successful.Please Login"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {register,login,logout,forgetPassword,resetPassword};

// POST /api/auth/forgot-password - Send reset email

// PUT /api/auth/reset-password/:token - Reset password

// GET /api/auth/verify/:token - Verify email