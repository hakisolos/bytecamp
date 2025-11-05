import e, { response } from "express";
import dotenv from 'dotenv'
import db from "../config/database";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import supabase from "../config/supabase";
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
        email: response.rows[0].email
    }, String(process.env.JWT_SECRET), { expiresIn: "7d" })
    return res.json({ success: false, message: "Login successful", jwt_token: token })
})



auth.get('/oauth/callback', async (req, res) => {
    const { data, error } = await supabase.auth.getUser(
        req.headers.authorization?.replace("Bearer ", "")
    )
    if (error) {
        res.status(400).json({ success: false, error: error.message })
    }
    const response = await db.query('SELECT * FROM users WHERE email = $1', [data.user?.email])
    if (response.rows.length === 0) {
        await db.query('INSERT INTO users (username, email, avatar) VALUES ($1, $2)', [data.user?.email?.split("@")[0], data.user?.email, data.user?.user_metadata.avatar_url])
    }
    res.json({ success: true, message: "user registered successfully" })
})
auth.get("/getuser", verifyToken, (req: any, res) => {
    return res.json(req.user)
})
export default auth

