import index from "../configs/pineconeConfig.js";
import prisma from "../configs/prismaConfig.js";

class NamespaceService {

  async getNamespaceService(name, userid) {
    try{
    const namespace = await prisma.namespace.findFirst({
      where: { name: name, user_id: userid },
    });
  
    return namespace
      ? { validated: true, values: namespace }
      : { validated: false, values: undefined };
  }catch(error) {
      return { validated: false, error: error };
    }
  }

  async findByIdService(id, userid) {
    try {
      const namespace = await prisma.namespace.findFirst({
        where: { id: id, user_id: userid },
        select: { id: true, name: true, pre_prompt: true },
      });
      return namespace
        ? { validated: true, values: namespace }
        : { validated: false, values: undefined };
    } catch (error) {
      return { validated: false, error: error };
    }
  }

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
      let editNamespace = {};
      pre_prompt ? (editNamespace.pre_prompt = pre_prompt) : null;

      await prisma.namespace.update({
        data: editNamespace,
        where: { id: id, user_id: userid },
      });

      return { validated: true };
    } catch (error) {
      return { validated: false, error: error?.message };
    }
  }

  async findNameSpaceByName(name) {
    try {
      const namespace = await prisma.namespace.findFirst({
        where: { name: name },
        select: { name: true, pre_prompt: true },
      });

      return namespace
        ? { validated: true, values: namespace }
        : { validated: false, values: undefined };
    } catch (error) {
      return { validated: false, error: error };
    }
  }

  async deleteNamespaceService(id, userid) {

    try{

      const namespace = await this.findByIdService(id, userid);

      if (!namespace.validated || !namespace.values) {
        return { validated: false, error: "Namespace não encontrado" };
      }
      const pc = index.namespace(namespace.values.name);
      await pc.deleteAll()
      await prisma.namespace.delete({
        where: { id: id, user_id: userid },
      });

      return { validated: true };


    }catch(error){
      return { validated: false, error: error?.message };
    }


  }
}

export default new NamespaceService();
