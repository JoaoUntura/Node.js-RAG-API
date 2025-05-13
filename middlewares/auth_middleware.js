import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken"

//iniciar a middleware

export default function middleware(req,res,next){
    const auth = req.headers['authorization']
    const token = req.cookies.token;
    console.log(token)
    if(auth != undefined){
        try {
            const bearer = auth.split(' ')
            let token = bearer[1]
            jwt.verify(token,process.env.SECRET)
            return next()
        } catch (error) {
            return res.status(403).json({success: false, erro: error, message:'Token inválido'})
        }

    }else{
        return res.status(403).json({success: false, message:'Usuário não Autenticado'})
    }
}