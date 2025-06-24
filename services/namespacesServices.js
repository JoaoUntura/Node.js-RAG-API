import index from "../configs/pineconeConfig.js";
import prisma from "../configs/prismaConfig.js";

class NamespaceService{
    async createNamespaceService(name, userid, pre_prompt) {
        try {
          const pc = index.namespace(name);
    
          await pc.upsertRecords([
            { id: "temp", chunk_text: "Ignore this info", category: "Temp" },
          ]);
    
          await prisma.namespace.create({
            data: { name: name, user_id: userid, pre_prompt: pre_prompt },
          });
    
          return { validated: true };
        } catch (error) {
          return { validated: false, error: error?.message };
        }
      }

      async updateNamespaceService(id, pre_prompt, userid) {
        try {
          let editNamespace = {}
          pre_prompt ? editNamespace.pre_prompt = pre_prompt : null
          
          await prisma.namespace.update({
            data: editNamespace, 
            where: { id: id, user_id: userid },
          });
    
          return { validated: true };
        } catch (error) {
          return { validated: false, error: error?.message };
        }
      }
}

export default new NamespaceService()