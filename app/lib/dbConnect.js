import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connection = {};

const connectDB = async () => {
    console.log("Connecting to MongoDB");
    if(connection.isConnected){
        // Use existing database connection
        console.log("Using existing connection");
        return;
    }
    
    // Use new database connection
    const db = await mongoose.connect("mongodb+srv://carnage:carnage123@wipsy.j6o8zjy.mongodb.net/?retryWrites=true&w=majority&appName=wipsy", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
};

export default connectDB;