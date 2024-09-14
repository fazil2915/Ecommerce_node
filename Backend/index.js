import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js"
import Auth from "./routes/auth.js";
import Seller from "./routes/seller.js"
import Buyer from "./routes/buyer.js"

const app=express()

//configuration
app.use(express.json());
dotenv.config()
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));

//morgan 
const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );


//api routes
// app.use("/",(req,res)=>{
//     res.send("hey there!!");
// })
app.use('/api/user',Auth)
app.use('/api/user/seller',Seller)
app.use('/app/user/buyer',Buyer)

//server
app.listen(process.env.PORT||5000,()=>{
    try {
        console.log(`server is running on ${process.env.PORT}`);
    } catch (error) {
        console.log("server failed on running",error.message);
        
    }
    
})