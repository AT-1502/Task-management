import mongoose from 'mongoose';



export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://akshat1361a:i8jhEhuFGJcap4Ud@cluster0.sy7rvio.mongodb.net/TaskManager");  
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    }