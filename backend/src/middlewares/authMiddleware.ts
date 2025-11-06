import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import supabase from "../config/supabase"
config()

export interface Authreq extends Request {
    user?: any
}

export const verifyToken = async (req: Authreq, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = req.cookies?.token || header?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "no token provided" })
    }

    try {
        const payload = jwt.verify(token, String(process.env.JWT_SECRET))
        req.user = payload;
        return next()
    } catch (e) {
        console.error(e)
    }
    const { data, error } = await supabase.auth.getUser(token)
    if (error) {
        res.status(403).json({ error: 'invalid token' })
    }
    req.user = {
        id: data.user?.id,
        email: data.user?.email,
        username: data.user?.email?.split("@")[0]
    }
    next()
}