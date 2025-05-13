import bcrypt from 'bcrypt'

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
}

export default new AuthServices()