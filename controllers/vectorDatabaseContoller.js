
import vectorService from "../services/vectorDatabaseServices.js"
import dataUtilsServices from "../services/dataUtilsServices.js";


class VectorDatabaseController{

    async insertNewData(req, res){

        let {namespace, data} = req.body

        const response = await vectorService.insertDataService(namespace,data)

        response.validated
        ?res.status(200).json({sucess:true})
        :res.status(400).json({sucess:false, data:response.error})
        
    }

    async getData(req, res){

        const response = await vectorService.getDataService()
        
        response.validated
        ?res.status(200).json({sucess:true, data:response.data})
        :res.status(400).json({sucess:false, data:response.error})


    }

    async uploadPdfData(req, res){
      
        let pdfPath = req.file.path;

        const text = await dataUtilsServices.processarPdf(pdfPath)
        const chuncks = dataUtilsServices.dividirTexto(pdfPath,"teste",text)

        ?res.status(200).json({sucess:true, data:chuncks})
        :res.status(400).json({sucess:false, data:response.error})
        
    }
}

export default new VectorDatabaseController()