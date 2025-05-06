import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from "dotenv"
dotenv.config()


const pc = new Pinecone({ apiKey: `${process.env.PINECONE}` });


const indexName = 'my-index';

const index = pc.index(indexName)

export default index