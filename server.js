import express from "express"
import cors from "cors"
import router from "./routes/router.js"

import { createServer } from 'node:http';
import setupSocketChat from "./configs/webSocketConfig.js";

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'DELETE' ],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors(corsOptions))
app.use('/', router)

const server = createServer(app);

setupSocketChat(server)


server.listen(3000, () => {

    console.log("Rodando API")

})

