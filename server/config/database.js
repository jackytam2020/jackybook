import mongoose from 'mongoose';
const db = process.env.MONGO_URL;

mongoose.set('strictQuery', false);

export const connectDB = async () => {
  try {
    mongoose.connect(
      'mongodb+srv://jackyt96:139715sY@cluster0.h6fkc3x.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
