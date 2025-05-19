import index from "../configs/pineconeConfig.js";
import prisma from "../configs/prismaConfig.js";

class VectorDatabaseServices{
    async createNamespaceService(namespace, userid){
      try{
      
        const pc = index.namespace(namespace)

        await pc.upsertRecords([{id:"temp", 
          chunk_text: "Ignore this info", 
          category: "Temp"}])

        await prisma.namespace.create({data:{name:namespace, user_id:userid}})
        
        return {validated:true}

      }catch(error){
        console.log(error)
        return {validated:false, error:error?.message}
      }
   
      
    }

    async insertDataService(namespace,data){
     
        try{
          const pc = index.namespace(`${namespace}`)
          if (Array.isArray(data)){
            await pc.upsertRecords(data)
          }else{
            await pc.upsertRecords([data])
          }
        
          return {validated:true}
        }catch(error){
          console.log(error)
          return {validated:false, error:error?.message}
        }
       
    }

    async getDataService(namespace){
      try{
        const pc = index.namespace(`${namespace}`)
        const data = await pc.listPaginated({ limit: 100 })
  
        const ids = data.vectors.map(vector => (vector.id !== 'temp' && vector.id ))
  
        const response = await pc.fetch(ids)
      
        const metadata = Object.keys(response.records).map(key => ({id:response.records[key].id, data:response.records[key].metadata}))
        
        return {validated:true, data:metadata}
      }catch(error){
        console.log(error)
        return {validated:false, error:error?.message}
      }
 
    }

    async deleteDataService(namespace, id){
      try{
        const pc = index.namespace(`${namespace}`)

        if (Array.isArray(id)){
            await pc.deleteMany(id)
        }else{
          await pc.deleteOne(id)
        }
      
        
        return {validated:true}
      }catch(error){
        console.log(error)
        return {validated:false, error:error?.message}
      }
 
    }


    async searchDataService(namespace,query){
      try{
        const pc = index.namespace(namespace)

        const results = await pc.searchRecords({
            query: {
              topK: 5,
              inputs: { text: query },
            },
            rerank: {
              model: 'bge-reranker-v2-m3',
              topN: 5,
              rankFields: ['chunk_text'],
            },
          });
          
        const formatedDocs = results.result.hits.map(hit=> (
            `category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`
        ))
     
        return {validated:true, data:formatedDocs}
      }catch(error){
        return {validated:false, error:error?.message}
      }  
          
    }

 

}

export default new VectorDatabaseServices()