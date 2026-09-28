import mongoose from "mongoose";

const MongoDb = async ()=>{
  try {
    const URI = process.env.MONGO_URI
    const Client = await mongoose.connect(URI)
    console.log('connected database!')
  } catch (error) {
        console.log('not connected database',error)
    }
}

export default MongoDb;
