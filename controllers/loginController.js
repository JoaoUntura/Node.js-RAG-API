//requerer o models usuario
import users from "../services/userServices.js"
import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken"
//requerer a função de comparar senha
import authServices from "../services/authServices.js"

class LoginController{
    async login(req, res){
        let {email, password} = req.body
        let user = await users.findByEmail(email)
        
        if(user.values != undefined){
       
            let passValiated = authServices.comparePasswordService(password, user.values.password)
            if(!passValiated){
               res.status(406).json({success: false, message:"Senha Invalida"})
            }else{
                let token = jwt.sign({userid: user.values.id},process.env.SECRET,{expiresIn:100000}) 
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, // Somente HTTPS em produção
                    sameSite: 'None', // Necessário se for em diferentes domínios
                    maxAge: 1000 * 60 * 60 * 24, // 1 dia
                    path: '/',
                  });
                res.status(200).json({success: true})
            }
        }else{
            user.values == undefined
            ? res.status(406).json({success: false, message:'E-mail não encontrado'})
            : res.status(404).json({success: false, message: user.error})
        }
    }

}

export default new LoginController();