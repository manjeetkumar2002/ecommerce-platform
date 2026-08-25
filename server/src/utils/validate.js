const validator = require("validator")
const validate = (email,password)=>{
    if(!validator.isEmail(email)){
        throw new Error("Invalid Email");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Weak Password");
    }
}

module.exports = validate