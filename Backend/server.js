import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/chat",chatRoutes);

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    console.log("MongoDB URI exists:", Boolean(uri));
    console.log("MongoDB URI type:", typeof uri);
    console.log("MongoDB URI prefix:", uri?.slice(0, 15));
    console.log("MongoDB URI length:", uri?.length);

    await mongoose.connect(uri);
    console.log("Connected with Database");
  } catch (err) {
    console.log("Failed to connect with DB:", err.message);
  }
};
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB();
