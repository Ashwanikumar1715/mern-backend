const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
   
    password: {
        type: String,
        required: true
    },

    cpassword: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ],
    tokens: [ // Initialize tokens property as an empty array
    {
        token: {
            type: String,
            required: true
        }
    }
]

})

//hashing the password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }
    next();
})


//jwt tokens implementaion

userSchema.methods.generateAuthToken= async function(){
    try {
        let token=jwt.sign({_id:this._id}, ASHWANIKUMARSACHINKUMARDEVPARTHINDRESHKUMAR);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

//message implementaion using concat
userSchema.methods.addmessage=async function(name,email,message){
    try {
       this.messages=this.messages.concat({name,email,message});
        await this.save();
       return this.messages;
    } catch (err) {
        console.log(err);
    }
}


const user=mongoose.model('users',userSchema);

module.exports=user;