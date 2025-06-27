
import dotenv from "dotenv"
dotenv.config()

class Ai{
    async generateReply(history, ) {
        try{
    
         
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPEN_ROUTER}`, // Your OpenRouter API key
         
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              transforms: ["middle-out"],
              "models": ["deepseek/deepseek-chat-v3-0324:free","deepseek/deepseek-r1-0528:free", "meta-llama/llama-4-maverick:free"],
              "messages": history,
            
            })
          });

        
       
        const data = await response.json();
   
          
        const message = data.choices[0].message.content;
     
        return message === '' ? 'Desculpe, não consegui entender sua pergunta. Pode reformular?' : message;
     
        }catch(error){
          console.log(error)
        }
        
    }
}

export default new Ai()