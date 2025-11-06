import e, { response } from "express";
import dotenv from 'dotenv'
import db from "../config/database";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Client, ID, Account, OAuthProvider, Avatars } from "appwrite";
import { verifyToken } from "../middlewares/authMiddleware";
import supabase from "../config/supabase";

dotenv.config()


const auth = e.Router()

const client = new Client().setEndpoint(String(process.env.APPWRITE_ENDPOINT)).setProject(String(process.env.APPWRITE_PROJECT_ID))
const account = new Account(client)

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
//https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/690cebfd002c70d11b51
auth.get('/outh/google', async (req, res) => {
    account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: 'http://localhost:8080/auth/oauth/callback',
        failure: 'http://localhost:8080/auth/oauth/failure'
    })
})
auth.get('/oauth/github', async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: "http://localhost:8080/api/auth/oauth/callback"
            }
        });
        if (error) return res.status(400).json({ success: false, message: error.message });
        res.redirect(data.url);
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


auth.get('/oauth/failure', (req, res) => {
    return res.send('OAuth failed 😔');
});

auth.get("/oauth/callback", async (req, res) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) return res.redirect("/api/auth/oauth/failure");
        const user = session.user;
        let username
        if (user.email) username = user.email.split("@")[0];

        const avatar = `https://ui-avatars.com/api/?name=${username}`;
        const response = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);
        if (response.rows.length === 0) {
            await db.query('INSERT INTO users (username, email, avatar) VALUES ($1, $2, $3)', [username, user.email, avatar]);
        }
        const token = jwt.sign({ id: user.id, username, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true, secure: false });
        res.redirect("http://localhost:8080/dashboard");
    } catch (e) {
        return res.status(500).send("Internal server error 😔");
    }
});

auth.get("/getuser", verifyToken, (req: any, res) => {
    return res.json(req.user)
})
export default auth

