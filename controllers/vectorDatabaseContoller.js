
import vectorService from "../services/vectorDatabaseServices.js"



class VectorDatabaseController{

    async insertNewData(req, res){
        console.log(req.body)
        let {namespace, data} = req.body

        const response = await vectorService.insertDataService(namespace,data)

        response.validated
        ?res.status(200).json({sucess:true})
        :res.status(400).json({sucess:false, data:response.error})
        
    }

    async getData(req, res){
        const namespace = req.params.namespace
      
        const response = await vectorService.getDataService(namespace)
        
        response.validated
        ?res.status(200).json({sucess:true, data:response.data})
        :res.status(400).json({sucess:false, data:response.error})

    }

    async deleteData(req, res){
        const namespace = req.params.namespace
        let {id} = req.body
        const response = await vectorService.deleteDataService(namespace,id)
        
        response.validated
        ?res.status(200).json({sucess:true})
        :res.status(400).json({sucess:false, data:response.error})

    }



}

export default new VectorDatabaseController()