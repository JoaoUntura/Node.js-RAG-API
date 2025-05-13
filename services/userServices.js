import prisma from "../configs/prismaConfig.js"

 class UserServices{

    async findAll(){
        try {
            const users = await prisma.user.findMany()
            return {validated: true, values:users}
        } catch (error) {
            return {validated: false, error: error}
        }
           }


    async findById(id){
        try{

            const user = await prisma.user.findUnique({where:{id:parseInt(id)}})
           console.log(user)
            return user
            ?{validated:true, values:user}
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
            await prisma.user.create({data:{email:email, name:name, password:password, active:active}})
            return {validated:true}
        }catch(error){
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