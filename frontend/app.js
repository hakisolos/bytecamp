import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static"
const app = new Hono()

app.use("/*", serveStatic({
    root: "./public"
}));

app.get("/", serveStatic({
    path: "./public/index.html"
}))
app.get("/signup", serveStatic({
    path: "./public/signup.html"
}))

app.get("/login", serveStatic({
    path: "./public/login.html"
}))
serve(app, (a) => {
    console.log(`app running on http://localhost${a.port}`)
})