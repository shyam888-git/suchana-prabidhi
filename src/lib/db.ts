import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;
    //check  mongodb already connected or not
    if (connectionState === 1) {
        console.log('Already connected');
        return;
    }
    if (connectionState === 2) {
        console.log("connecting.......");
        return;
    }

    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: process.env.db_name,
            bufferCommands: true
        })
        console.log("connected");

    }
    catch (err: any) {
        console.log("Error:", err);
        throw new Error("Error", err);


    }
}

export default connect;
