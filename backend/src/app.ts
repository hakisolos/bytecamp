import e from "express";
import type { Application, Request, Response } from "express";
import auth from "./routes/authRoute";
import coursesRouter from "./routes/courseRoutes";
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()




const app: Application = e()
const PORT = process.env.PORT || 3001


app.use(e.json())
app.use(cookieParser())
app.use(cors())
app.use("/api/auth", auth)
app.use("/api/course", coursesRouter)
app.get("/", (req: Request, res: Response) => {
    return res.send("hello world")
})




app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})

