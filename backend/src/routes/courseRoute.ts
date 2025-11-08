import { Router } from "express";

const coursesRouter = Router()



coursesRouter.get('/', (req, res) => {
    return res.send('course api running')
})


export default coursesRouter