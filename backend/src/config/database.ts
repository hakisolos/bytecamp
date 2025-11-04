import { Pool } from "pg";
import dotenv from 'dotenv'
dotenv.config()

const db = new Pool({
    connectionString: String(process.env.CSTRING),
    ssl: false
})


export default db

