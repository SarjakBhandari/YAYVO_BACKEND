import express, {Application, Request, Response} from 'express';
// import { connectDatabase } from './database/mongodb';
// import  userrouter  from "./routes/user.routes"
// import books from './routes/book.route';
import bodyParser from 'body-parser';
import { PORT } from './config';
// import path from 'path';
// import authUserRoutes from './routes/admin/user.route';

//definations
const app: Application = express(); 

app.use(bodyParser.json());

//routes
app.get('/',(req: Request,res:Response)=>{
    res.send('API IS RUNNING GOOD')
});
// app.use("/api/auth",userrouter)

// async function startServer() {
//     await connectDatabase();
    
app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`)
});
// }
// startServer();


