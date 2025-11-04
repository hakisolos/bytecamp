import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

export interface Authreq extends Request {
    user?: any
}

export const verifyToken = (req: Authreq, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "no token provided" })
    }

    try {
        const payload = jwt.verify(token, String(process.env.JWT_SECRET))
        req.user = payload;
        next()
    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: e })
    }
}