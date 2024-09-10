const express =require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();

//used express.json() to get data into json format
app.use(express.json());

//PORT
const PORT = process.env.PORT || 5500;

//use cors
app.use(cors());

//import routes
const TodoItemRoute=require('./routes/todoItems');

//Connection to mongoDB...
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("Connected to Database...");
})
.catch((error)=>{
  console.log(error.message);
})

//use routes
app.use('/',TodoItemRoute);  

//connect to server
app.listen(PORT,()=>{
  console.log("Server Started at 5000...");
})