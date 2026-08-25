const jwt = require("jsonwebtoken");

const genToken =async (user)=>{
     const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "1d"
        }
    );
}

module.exports = genToken