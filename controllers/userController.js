import user from "../services/userServices.js"
import authServices from "../services/authServices.js"

class UserControllers{

    async listAll(req,res){
        let result = await user.findAll()
        !result.validated
        ?res.status(404).json({success:false, message: result.error})
        :res.status(200).json({success:true, values: result.values})
    }
    

    async verifyPublicApi(req, res){
        let {apikey} = req.body
        let result = await user.verifyPublicApiService(apikey)
        
        !result.validated
        ?res.status(404).json({success:false, message: result.error})
        :res.status(200).json({success:true})


    }

    async newUser(req,res){
    
        let {email, name, password} = req.body
        

        let result = await user.create(email, name, authServices.hashPasswordService(password), true)

        result.validated
        ?res.status(201).json({success:true, message:"User criado com successo!"})
        :res.status(404).json({success:false, message:result.error})
    }
    
    async editUser(req,res){
        let id = req.params.id
        let {nome, email} = req.body

        if (isNaN(id)){
            res.status(406).json({success:false, message: "Id inválido!"})
        }else{
            let result = await user.update(id,nome, email)

            result.validated 
            ?res.status(200).json({success:true, message:"Update realizado com successo"})
            :res.status(404).json({success:false, message:result.error})
        }

   
    }

    async deleteUser(req,res){
        let id = req.params.id

        if (isNaN(id)){
            res.status(406).json({success:false, message: "Id inválido!"})
        }else{
            let result = await user.delete(id)

            result.validated 
            ?res.status(200).json({success:true, message:"Deletado com successo"})
            :res.status(404).json({success:false, message:result.error})
        }

   
    }
    
}

export default new UserControllers()