import prisma from "../configs/prismaConfig.js"
import authServices from "./authServices.js"

 class UserServices{

    async findById(userid){
        try {
            const user = await prisma.user.findUnique({where:{id:userid}, select:{name:true, public_api_key:true}})
            const namespaces = await prisma.namespace.findMany({where:{user_id:parseInt(userid)}, select:{id:true, name:true, pre_prompt:true}})
            return {validated: true, values:{user:user, namespaces:namespaces}}
        } catch (error) {
            return {validated: false, error: error}
        }
           }


    async findUserIdByNamespace(name){
        try{

            const user = await prisma.namespace.findFirst({where:{name:name}, select:{user_id:true}})
            
    
            return user
            ?{validated:true, values:user.user_id}
            :{validated:true, values:undefined}

        }catch(error){
            return {validated: false, error: error}
        }
    }

 

    async findByEmail(email){
        try{
         
            const user = await prisma.user.findFirst({where:{email:email}})
            return user
            ?{validated:true, values:user}
            :{validated:true, values:undefined}

        }catch(error){
            return {validated: false, error: error}
        }
    }

    async create(email, name, password, active){
       
        try{
            const user = await prisma.user.create({data:{email:email, name:name, password:password, active:active}})
         
            await prisma.user.update({where:{id:user.id}, data:{public_api_key:authServices.generateApiKey(user.id)}})
            return {validated:true}
        }catch(error){
            return {validated: false, error: error}
        }
    }

    async verifyPublicApiService(apikey){
       
        try{
            const payload = authServices.verifyApiKey(apikey)

            const user = await prisma.user.findUnique({where:{id:parseInt(payload.userid)}})

            if (user && user.active){
                return {validated: true}
            }else{
                return {validated: false, error: "User não ativo"}
            }
            
          
        }catch(error){
            return {validated: false, error: error}
        }
    }

    async verifyNameSpace(userid, namespace){
       
        try{
    
            const {user} = await prisma.namespace.findUnique({where:{user_id:parseInt(userid), name:namespace}, select:{user:{select:{active:true}}}})
 
            if (user && user.active){
                return {validated: true}
            }else{
                return {validated: false, error: "User não ativo"}
            }
            
          
        }catch(error){
            console.log(error)
            return {validated: false, error: error}
        }
    }

    async update(id, name, email){

        let user = await this.findById(id)

        if(user.validated && user.values != undefined){
           
            let editUser = {}
            name ? editUser.name = name : null
            email ? editUser.email = email : null

            try{
                await prisma.user.update({where:{id:parseInt(id)}, data:editUser})
                return {validated:true}
            }catch(error){
                return {validated: false, error: error}
            }

        }else{
            return {validated:false, error: "User não existente"}
        }

    }

    async delete(id){
        const validation = await this.findById(id)
    
        if (validation.values != undefined){
    
            try{
                await prisma.user.delete({where:{id:parseInt(id)}})
                return {validated:true}
    
            }catch(error){
                return {validated:false, error:error}
            }
    
        }else{
            return {validated:false, error: "User não existente"} 
        }
    
    }


}   

export default new UserServices()