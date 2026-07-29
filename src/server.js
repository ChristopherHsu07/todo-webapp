import express from "express"
import path, {dirname} from "path"
import {fileURLToPath} from "url"
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import authMiddleware from "./middleware/auth.js"

const app = express()

// Checks .env file to see if port is already defined there.
const port = process.env.PORT || 3000

// figure out filename from URL of curent module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Serves html file from /public directory

// Middleware
app.use(express.static(path.join(__dirname, "../public")))
app.use(express.json())

//Serve HTML file from /public
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

//Routes

// Combines /auth route with all authroutes in authRoutes.js
app.use("/auth", authRoutes)
// as well as todoRoutes.js
app.use("/todos", authMiddleware, todoRoutes)

app.listen(port, () => {
    console.log("Server running on port 3000");
})