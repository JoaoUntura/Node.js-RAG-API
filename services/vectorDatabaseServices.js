import index from "../configs/pineconeConfig.js";
import prisma from "../configs/prismaConfig.js";

class VectorDatabaseServices {


  async insertDataService(namespace, data) {
    try {
      const pc = index.namespace(`${namespace}`);
      if (Array.isArray(data)) {
        await pc.upsertRecords(data);
      } else {
        await pc.upsertRecords([data]);
      }

      return { validated: true };
    } catch (error) {
      console.log(error);
      return { validated: false, error: error?.message };
    }
  }

  async getDataService(namespace, pagTokenUser) {
    try {
      const pc = index.namespace(`${namespace}`);

      const data = pagTokenUser
        ? await pc.listPaginated({ limit: 50, paginationToken: pagTokenUser })
        : await pc.listPaginated({ limit: 50 });

      const paginationToken = data?.pagination?.next;

      const ids = data.vectors.map(
        (vector) => vector.id !== "temp" && vector.id
      );

      const response = await pc.fetch(ids);

      const metadata = Object.keys(response.records).map((key) => ({
        id: response.records[key].id,
        data: response.records[key].metadata,
      }));

      return {
        validated: true,
        data: { vectors: metadata, paginationToken: paginationToken },
      };
    } catch (error) {
      console.log(error);
      return { validated: false, error: error?.message };
    }
  }

  async deleteDataService(namespace, id) {
    try {
      const pc = index.namespace(`${namespace}`);

      if (Array.isArray(id)) {
        await pc.deleteMany(id);
      } else {
        await pc.deleteOne(id);
      }

      return { validated: true };
    } catch (error) {
      console.log(error);
      return { validated: false, error: error?.message };
    }
  }

  async searchDataService(namespace, query) {
    try {
      const pc = index.namespace(namespace);
    
      const results = await pc.searchRecords({
        query: {
          topK: 10,
          inputs: { text: query },
        },
        rerank: {
          model: "bge-reranker-v2-m3",
          topN: 3,
          rankFields: ["chunk_text"],
        },
      });


      const formatedDocs = results.result.hits.map(
        (hit) => (`category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`)
      );

      const ids = results.result.hits.map((hit) => hit._id);
  
      return { validated: true, data: {docs:formatedDocs, ids:ids} };
    } catch (error) {
      return { validated: false, error: error?.message };
    }
  }
}

export default new VectorDatabaseServices();
