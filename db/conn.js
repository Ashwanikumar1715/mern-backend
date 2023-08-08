const mongoose=require('mongoose');

const DB='mongodb+srv://ashwani:ashwani@cluster0.z1gmjnk.mongodb.net/userData?retryWrites=true&w=majority';

mongoose.connect(DB).then(()=>{
    console.log("connected succesfully");

}).catch((err)=> console.log(err));