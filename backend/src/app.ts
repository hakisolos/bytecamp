import e from "express";
import type { Application, Request, Response } from "express";

import dotenv from 'dotenv'
dotenv.config()




const app: Application = e()
const PORT = process.env.PORT || 3001


app.use(e.json())

app.get("/", (req: Request, res: Response) => {
    return res.send("hello world")
})




app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})

