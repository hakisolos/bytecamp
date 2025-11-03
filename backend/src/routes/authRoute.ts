import e from "express";
import dotenv from 'dotenv'
import db from "../config/database";
import bcrypt from 'bcrypt'
dotenv.config()


const auth = e.Router()



auth.get('/', (req, res) => {
    return res.send('auth service running')
})
// avatar , level and rank
auth.post('/signup', (req, res) => {
    let { username, email, password } = req.body()
    if (!username || !email || !password) {
        return res.status(401).json('bad request')
    }


})



export default auth
