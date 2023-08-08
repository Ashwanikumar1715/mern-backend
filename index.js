const express=require('express');
const app=express();

const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const PORT=process.env.PORT||8080;


//connection to db
require('./db/conn')
app.use(express.json());

//router in use
app.use(require('./router/auth'))






app.get('/about',(req,res)=>{
    res.send("hello this is about page");
})
app.get('/contact',(req,res)=>{
    res.send("hello this is contact page");
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
}

app.listen(PORT,()=>{
    console.log(`the server is running at port:${PORT}`);
})