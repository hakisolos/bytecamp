import { Router } from "express";
import db from "../config/database";
import { config } from "dotenv";
import { verifyToken } from "../middlewares/authMiddleware";
import { addExpoints, uploadToCdn } from "../utils";
import multer = require("multer");
config()

const user = Router()


const storage = multer.memoryStorage()
const upload = multer({ storage })


user.get('/', (req, res) => {
    res.send('user service running')
})


user.get('/profile', verifyToken, async (req: any, res) => {
    const user = req.user

    const response = await db.query('SELECT * FROM users WHERE email = $1', [user.email])

    if (response.rows.length === 0) {
        return res.status(404).json({ success: false })
    }

    return res.status(200).json({ success: true, data: response.rows[0] })

})

user.get('/getprofile', async (req, res) => {
    const { email } = req.query

    if (!email) return res.status(403).json({ success: false, message: "email required" })

    const response = await db.query('SELECT username,email,followers,following, courses,avatar,level,rank,expoints,joined_at FROM  users WHERE email = $1', [email])
    if (response.rows.length === 0) {
        return res.status(404).json({ success: false })
    }
    return res.status(200).json({ success: true, data: response.rows[0] })

})

user.post("/addexp", async (req, res) => {
    const { email, points } = req.body

    if (!email || !points) {
        return res.status(403).json({ success: false, mssage: "invalid request" })
    }

    try {
        const response = await addExpoints(email, points)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ error: e })
    }
})
user.post('/follow', verifyToken, async (req: any, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "bad request" });

    try {
        const target = await db.query(
            "SELECT followers FROM users WHERE email = $1",
            [email]
        );

        if (!target.rows[0]) return res.status(404).json({ success: false, message: "User not found" });

        const targetFollowers: string[] = target.rows[0].followers || [];

        if (targetFollowers.includes(req.user.email)) {
            return res.status(200).json({ success: false, message: "Already following" });
        }

        await db.query("UPDATE users SET followers = array_append(followers, $1) WHERE email = $2", [
            req.user.email,
            email,
        ]);

        await db.query("UPDATE users SET following = array_append(following, $1) WHERE email = $2", [
            email,
            req.user.email,
        ]);

        return res.status(200).json({ success: true, message: "Followed successfully" });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
});


user.get('/followers', async (req: any, res) => {
    const { email } = req.query;

    if (!email) return res.status(400).json({ success: false, message: "bad request" });

    try {
        const result = await db.query(
            "SELECT followers FROM users WHERE email = $1",
            [email]
        );

        if (!result.rows[0]) return res.status(404).json({ success: false, message: "User not found" });

        const followers: string[] = result.rows[0].followers || [];
        return res.status(200).json({ success: true, followers });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
});

user.post('/updatePP', verifyToken, async (req: any, res) => {
    const user = req.user
    const buff = req.file?.buffer
    try {
        if (!buff) {
            return res.status(400).json({ message: "no file uploaded" })
        }
        const ppurl = await uploadToCdn(buff)

        if (ppurl) {
            await db.query("UPDATE users SET avatar = $1 WHERE email = $2", [ppurl, req.user.email])
        }
        return res.status(200)
    } catch (e) {
        console.log("an error occured")
        return res.status(500).json({ err: e })
    }


})
export default user


user.get('/uploadToCdn', upload.single("file"), async (req, res) => {
    const buff = req.file?.buffer
    try {
        if (!buff) {
            return res.status(400).json({ message: "no file uploaded" })
        }
        await uploadToCdn(buff)
    } catch (e) {
        console.log("an error occured")
        return res.status(500).json({ err: e })
    }
})