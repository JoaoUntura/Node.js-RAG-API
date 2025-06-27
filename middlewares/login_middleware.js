import dotenv from 'dotenv'
dotenv.config()


//iniciar a middleware
export default function loginMiddleware(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_END_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
   
}