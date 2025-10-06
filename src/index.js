import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at : ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("Mongo DB connection failed : ",error)
    process.exit(1)
})