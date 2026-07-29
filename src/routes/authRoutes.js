import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../prismaClient.js"

// make a router that is a subset of our app to define routs
// We can connects this to our app in server.js
const router = express.Router()

// Register a new user endpoint, POST /auth/user
router.post("/register", async (req, res) => {
    const {username, password} = req.body
    
    //encryption:
    const hashedPassword = bcrypt.hashSync(password, 8)

    // Save new user and hashed password
    try{
        const user = await prisma.user.create({
            data:{
                username,
                password: hashedPassword
            }
        })

        // for new users, add a default todo
        const defaultTodo = "Hello :) Add your first Todo!"
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })
        
        // create a token so users can only alter their own todos
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, 
        {expiresIn: "24h"})
        res.json({token})

    } catch (err){
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post("/login", async (req, res) => {
    // get the email from the request, the look up associated password
    // compare password encrypted with same algorithm
    const {username, password} = req.body
    
    try{
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // if incorrect username, return to user
        if(!user){
            return res.status(404).send({message: "User not found"})
        }
        
        // if password doesn't match, return to user
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if(!passwordIsValid){
            return res.status(401).send({message: "Invalid Password"})
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"})
        res.json({token})
    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router