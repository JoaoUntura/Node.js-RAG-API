import express from "express"
import cors from "cors"
import router from "./routes/router.js"
import cookieParser from 'cookie-parser';

import { createServer } from 'node:http';
import setupSocketChat from "./configs/webSocketConfig.js";

const app = express()
app.use(cookieParser()); // ← Aqui
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const allowedOrigins = ['https://front-rag-one.vercel.app', 'http://localhost:3001']; // ajuste aqui

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use('/', router)

const server = createServer(app);

setupSocketChat(server)


server.listen(3000, () => {

    console.log("Rodando API")

})

