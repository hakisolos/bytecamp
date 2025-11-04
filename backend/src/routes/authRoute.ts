import e from "express";
import dotenv from 'dotenv'
import db from "../config/database";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { verifyToken } from "../middlewares/authMiddleware";

dotenv.config()


const auth = e.Router()

auth.get('/', (req, res) => {
    return res.send('auth service running')
})


auth.post('/signup', async (req, res) => {
    let { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(401).json('bad request')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await db.query('SELECT username, email FROM users WHERE username = $1 AND email = $2', [username, email])
    if (response.rows.length > 0) {
        return res.status(409).json({ success: false, message: "A user with this username already exists" })
    }
    await db.query('INSERT INTO users(username, email, password) VALUES ($1,$2,$3)', [username, email, hashedPassword])

    return res.status(200).json({ success: true })
})


auth.post('/login', async (req, res) => {
    const { username, email, password } = req.body
    const uname = username || email
    if (!uname || !password) {
        return res.status(401).json({ success: false, message: "bad request" })
    }
    const response = await db.query("SELECT * FROM users WHERE (username = $1 OR email = $1)", [uname])
    if (response.rows.length === 0) {
        res.status(404).json({ success: false, message: `user not found` })
    }
    const pass = response.rows[0].password
    if (!(await bcrypt.compare(password, pass))) {
        return res.status(401).json({ success: false, message: "incorrect password" })
    }
    const token = jwt.sign({
        id: response.rows[0].username,
        username: response.rows[0].username,
        email: response.rows[0].email,
        followers: response.rows[0].followers,
        following: response.rows[0].following,
        courses: response.rows[0].courses,
        avatar: response.rows[0].avatar,
        level: response.rows[0].level,
        joined_at: response.rows[0].joined_at
    }, String(process.env.JWT_SECRET), { expiresIn: "7d" })
    return res.json({ success: false, message: "Login successful", jwt_token: token })
})

auth.get("/getuser", verifyToken, (req: any, res) => {
    return res.json(req.user)
})
export default auth

