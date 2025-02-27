import mongoose from 'mongoose';

const connectDB = async () => {
    try{
       mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
       });
       console.log('mongodb connected successfully')
    }catch(error){
        console.error("MongoDB connection error:", error);
    }
}
export default connectDB;