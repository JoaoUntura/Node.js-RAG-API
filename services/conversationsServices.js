import prisma from "../configs/prismaConfig.js";
import userServices from "./userServices.js";

class CoversationsServices {
  
  async createConversationService(clientId, namespace) {
    try {

      const userId = await userServices.findUserIdByNamespace(namespace);

      const conversation = await prisma.conversations.create({
        data: {
          date: new Date().toISOString(),
          client_id: clientId,
          user_id: parseInt(userId.values),
          namespace: namespace,
        },
      });
      return { validated: true, values: conversation.id };
    } catch (error) {
      return { validated: false, error: error.message };
    }
  }

  async addMessageService(conversationId, content) {
    try {
      const message = await prisma.messages.create({
        data: {
          content: content,
          conversation_id: parseInt(conversationId),
        },
      });
      return { validated: true, values: message.id };
    } catch (error) {
      return { validated: false, error: error.message };
    }
  }

  async getConversationsService(userId, namespace, page) {
    try {



      const conversations = await prisma.conversations.findMany({
        where: { user_id: parseInt(userId), namespace: namespace },

        select: {
          id: true,
          namespace: true,
          date: true,
          client_id: true,
        },
        
      })
        return { validated: true, values: conversations };
      
    } catch (error) {
      return { validated: false, error: error.message };
    }
  }

  async getMessagesService(conversationId, userId) {
    try {
      const messages = await prisma.messages.findMany({
        where: { conversation_id: parseInt(conversationId), conversations: { user_id: parseInt(userId) } },
        orderBy: { created_at: 'asc' },
      });
      return { validated: true, values: messages };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { validated: false, error: error.message };
    }
  }

}

export default new CoversationsServices();
