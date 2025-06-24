import conversationsServices from "../services/conversationsServices.js";

class CoversationsController{

    async getConversations(req, res) {

        const id = parseInt(req.userid)

        const namespace = req.params.namespace 

        const response = await conversationsServices.getConversationsService(id,namespace)

        response.validated 
        ?res.status(200).json({success:true, data: response.values})
        :res.status(404).json({success:false, data:response.error})


    }

    async getMessages(req, res) {

        const conversationId  = req.params.conversationId

        const id = parseInt(req.userid)

        const response = await conversationsServices.getMessagesService(conversationId, id)

        response.validated 
        ?res.status(200).json({success:true, data: response.values})
        :res.status(404).json({success:false, data:response.error})

    }

}

export default new CoversationsController();