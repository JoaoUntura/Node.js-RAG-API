import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken"

//iniciar a middleware
export default function middleware(req,res,next){
    const auth = req.headers['authorization']
    
    if(auth != undefined){
        try {
            const bearer = auth.split(' ')
            let token = bearer[1]
            let payload = jwt.verify(token,process.env.SECRET)
            
            req.userid = payload.userid

            return payload
            ? next()
            : res.status(403).json({success: false, message:'Usuário sem permissão,'})
            
        } catch (error) {
            return res.status(403).json({success: false, erro: error, message:'Token inválido'})
        }

    }else{
        return res.status(403).json({success: false, message:'Usuário não Autenticado'})
    }
}