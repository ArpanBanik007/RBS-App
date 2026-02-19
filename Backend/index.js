import app from "./app.js"
import connectDB from "./DB/index.js"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

connectDB()
.then(()=>{

app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`server is running at ${process.env.PORT}`);
    
})

})
.catch((error)=>{console.log("MongoDB connection error",error);
})