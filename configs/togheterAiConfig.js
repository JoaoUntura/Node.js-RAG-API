import Together from "together-ai";
import dotenv from "dotenv"
dotenv.config()

const ai = new Together(process.env.TOGETHER_API_KEY); // auth defaults to process.env.TOGETHER_API_KEY

export default ai

