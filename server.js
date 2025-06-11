import express from "express"
import cors from "cors"
import router from "./routes/router.js"
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import setupSocketChat from "./configs/webSocketConfig.js";
import cookieParser from 'cookie-parser';
const app = express()
dotenv.config();

app.use(cors({
    origin: process.env.FRONT_END_URL, // ou o domínio do seu frontend
    credentials: true
  }));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser());
app.use('/', router)

const server = createServer(app);

setupSocketChat(server)


server.listen(3000, () => {

    console.log("Rodando API")

})

