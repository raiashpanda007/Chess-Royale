import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/route"
dotenv.config()
const app = express()
app.use(
    cors({
      origin: `https://web.chesssroyale.games`, // Your frontend URL
      credentials: true, // Allow credentials (cookies, tokens, etc.)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed https methods
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token','communityid','userid','postid'], // Allowed headers
    })
  )
app.use(express.json());

app.listen(3001,()=>{
    console.log("Server is running on port 3001")
})

app.use("/",router)