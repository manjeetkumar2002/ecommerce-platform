const express = require("express")
require("dotenv").config()
const app = express();
const PORT = process.env.PORT || 5000
const connectDB = require("./src/config/database.js");
const authRouter = require("./src/routes/auth.routes.js")
const cookieParser = require("cookie-parser")
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth/',authRouter);

const initializeConnection = async ()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Listening at port: ${PORT}`);
    })
};

initializeConnection();