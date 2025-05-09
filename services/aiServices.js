import ai from "../configs/togheterAiConfig.js";
class Ai{
    async generateReply(history){
        try{
          const response = await ai.chat.completions.create({
            model:"meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages: history,
        })
    
        return response.choices[0].message.content
        }catch(error){
          console.log(error)
        }
        
    }
}

export default new Ai()