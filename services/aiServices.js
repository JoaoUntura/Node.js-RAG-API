
import dotenv from "dotenv"
dotenv.config()

class Ai{
    async generateReply(history){
        try{
         
          console.time("tempoExecucaoAI");

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPEN_ROUTER}`, // Your OpenRouter API key
         
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "meta-llama/llama-4-maverick:free",
              "messages": history
            })
          });


       
        const data = await response.json();


        console.timeEnd("tempoExecucaoAI");
    
        return data.choices[0].message.content
        }catch(error){
          console.log(error)
        }
        
    }
}

export default new Ai()