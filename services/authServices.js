import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()

class AuthServices{
    hashPasswordService(password){
        let salt = bcrypt.genSaltSync(10)
        let passHash = bcrypt.hashSync(password, salt)
        
        return passHash
    
    }

    comparePasswordService(password, user_password){
        let isPassword = bcrypt.compareSync(password, user_password)
        return isPassword
    }

    generateApiKey(userid){
        const apiKey = jwt.sign({userid:userid, api:'PUBLIC'}, process.env.API_SECRET)
        return apiKey
    }

    verifyApiKey(apikey){
        const payload = jwt.verify(apikey,process.env.API_SECRET)
        return payload
    }
}

export default new AuthServices()