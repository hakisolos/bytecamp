import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config()

const supabase = createClient(String(process.env.SUPABASE_URL), String(process.env.SUPABASE_ANON_KEY))

export default supabase;