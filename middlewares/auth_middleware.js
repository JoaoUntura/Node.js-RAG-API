import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken"

//iniciar a middleware
export default function middleware(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_END_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    let token = req?.cookies?.token

    if(token){
        try {
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