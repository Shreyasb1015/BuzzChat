import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new Schema({
    
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,    
    },
    profilePicture:{
        type:String,
        default:"",
    },
    password:{
        type:String,
        required:true,
        max:[8,"Password must be at most 8 characters long"],
    },
    refreshToken:{

        type:String,
    }
},{timestamps:true});


userSchema.pre("save",async function(next){

    if(!this.isModified("password"))
    {
        next();
    
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.matchPassword=async function(password){

    return await bcrypt.compare(password,this.password);

}

userSchema.methods.generateAccessToken=function(){

    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email, 
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRY)})
}

userSchema.methods.generateRefreshToken=function(){

    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRY)})
}


export const User=mongoose.model("User",userSchema);