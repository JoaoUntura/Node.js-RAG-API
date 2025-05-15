import express from "express"
import cors from "cors"
import router from "./routes/router.js"


import { createServer } from 'node:http';
import setupSocketChat from "./configs/webSocketConfig.js";

const app = express()

app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/', router)

const server = createServer(app);

setupSocketChat(server)


server.listen(3000, () => {

    console.log("Rodando API")

})

