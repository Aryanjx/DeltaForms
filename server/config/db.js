import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/deltaforms');
    console.log(`🔌 DeltaForms Core Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connectivity Failure: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;