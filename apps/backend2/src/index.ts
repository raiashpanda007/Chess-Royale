import express from "express"
import cors from "cors"
import router from "./routes/route"
const app = express()
app.use(
    cors({
      origin: `${process.env.BASE_URL}:3000`, // Your frontend URL
      credentials: true, // Allow credentials (cookies, tokens, etc.)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token','communityid','userid','postid'], // Allowed headers
    })
  )
app.use(express.json());

app.listen(3001,()=>{
    console.log("Server is running on port 3001")
})

app.use("/",router)