// Product schema (title, price, description).  

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:[0,'price can not be negative']
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:[10,"Description must be at least 10 characters"]
    }
},{timestamps:true})

export default mongoose.model('Product',productSchema)