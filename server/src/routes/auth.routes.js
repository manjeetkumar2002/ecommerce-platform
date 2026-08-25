const express = require("express");
const { register, login, logout, forgetPassword, resetPassword } = require("../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/forget-password",forgetPassword)
authRouter.put("/reset-password/:token",resetPassword)
module.exports = authRouter