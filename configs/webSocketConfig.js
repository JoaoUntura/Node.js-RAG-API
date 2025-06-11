import { Server } from "socket.io";
import vectorDatabaseServices from "../services/vectorDatabaseServices.js";
import aiServices from "../services/aiServices.js";
const context = new Map();

function addMessage(userId, message) {
  if (!context.has(userId)) {
    context.set(userId, []);
  }

  const userMessages = context.get(userId);

  userMessages.push(message);

  if (userMessages.length > 5) {
    userMessages.shift();
  }

  context.set(userId, userMessages); 
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
            socket.userId = userId; 
          
            const docs = await vectorDatabaseServices.searchDataService(`${namespace}`, message)

            if (getMessages(userId).length > 0){
              addMessage(userId, { role: 'user', content: `Seguindo o histórico da conversa. De acordo com esta pergunta do usuário: ${message}. 
              Crie uma resposta, sem se apresentar novamente, para o usuário de acordo com estas informações: ${docs.data},
              Formate este texto de forma organizada para ser exibido em uma interface. 
              Use títulos, bullets, separações por seção, espaçamento entre paragrafos com "\n" e destaque com emojis se útil`});
            }else{
               addMessage(userId, { role: 'user', content: `Você é um assistente chatbot que ajuda o usuário sobre informações em relação à empresa.
              De acordo com esta pergunta do usuário: ${message}. 
              Crie uma resposta para o usuário de acordo com estas informações: ${docs.data} 
              Formate este texto de forma legível para ser exibido em uma interface. 
              Use títulos, bullets, espaços, separações por seção, espaçamento entre paragrafos com "\n" e destaque com emojis se útil`, });
            }
           

            const history = getMessages(userId)
            
        
            // Envia para a IA com o contexto
            const response = await aiServices.generateReply(history);
           
            // Armazena resposta da IA
            addMessage(userId, { role: 'system', content: response });
        
            // Envia para o frontend
            socket.emit('bot_reply', response);
          });

        socket.on('disconnect', () => {
          if (socket.userId) {
            context.delete(socket.userId);
          }
        });

    });

}

