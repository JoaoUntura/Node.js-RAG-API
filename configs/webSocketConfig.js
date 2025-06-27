import { Server } from "socket.io";
import vectorDatabaseServices from "../services/vectorDatabaseServices.js";
import namespacesServices from "../services/namespacesServices.js";

import aiServices from "../services/aiServices.js";
import conversationsServices from "../services/conversationsServices.js";

const context = new Map();

async function addMessage(conversationId, userId, message) {

  if (!context.has(userId)) {
    context.set(userId, []);
  }

  const userMessages = context.get(userId);

  userMessages.push(message);


  if (userMessages.length > 5) {
    userMessages.shift();
  }

  context.set(userId, userMessages);

  if (conversationId) {
    await conversationsServices.addMessageService(conversationId, message);
  }
}

function getMessages(userId) {
  return context.get(userId) || [];
}

export default function setupSocketChat(server){

    const io = new Server(server, {
        path: '/chatbot', // 🔁 muda a "rota" do WebSocket
        cors: { origin: '*' },
      });
    
    io.on('connection', (socket) => {


        socket.on('user_message', async ({ userId, message, namespace }) => {

          if (!socket.userId || !socket.namespace ) {

            socket.namespace = namespace; // Armazena o namespace na conexão do socket
            socket.userId = userId; // Armazena o userId na conexão do socket
            
            const response = await namespacesServices.findNameSpaceByName(`${namespace}`);
      
            if (!response.validated || !response.values) {
                socket.emit('error', 'Namespace não encontrado ou inválido.');
                return;
            }
            socket.pre_prompt = response.values.pre_prompt || "Você é um assistente chatbot que ajuda o usuário sobre informações em relação à empresa";

          }

            console.time("tempoExecucaoGeral");

            const responseDocs = await vectorDatabaseServices.searchDataService(`${namespace}`, message)

            const docsText = responseDocs.data.docs.join(", ");

            let newMessageInstructions;
           
            if (getMessages(userId).length > 0){
              newMessageInstructions =  { role: 'user', content: `${socket.pre_prompt}. Seguindo o histórico da conversa. De acordo com esta pergunta do usuário: ${message}. Crie uma resposta para o usuário, não invente informações, mantendo o contexto da conversa. Use títulos, bullets, separações por seção, espaçamento entre paragrafos com "\n" e destaque com emojis se útil para o usuário de acordo com estas informações: ${docsText}.`};
            }else{
              const response = await conversationsServices.createConversationService(userId, namespace);
              socket.conversationId = response.validated ? response.values : null;
              newMessageInstructions = { role: 'user', content: `${socket.pre_prompt}. De acordo com esta pergunta do usuário: ${message}.Crie uma resposta para o usuário, não invente informações, mantendo o contexto da conversa. Use títulos, bullets, separações por seção, espaçamento entre paragrafos com "\n" e destaque com emojis se útil para o usuário de acordo com estas informações: ${docsText}.` };
            }
            
            const history = getMessages(userId)

            // Envia para a IA com o contexto
            const response = await aiServices.generateReply([...history, newMessageInstructions]);

            // Envia para o frontend
            socket.emit('bot_reply', response);

            // Armazena respostas
            addMessage(socket.conversationId, userId, { role: 'user', content: message });
            addMessage(socket.conversationId, userId, { role: 'assistant', content: response });
              
            console.timeEnd("tempoExecucaoGeral");
     
          });

        socket.on('disconnect', () => {
          if (socket.userId) {
            context.delete(socket.userId);
            
          }
        });

    });

}

