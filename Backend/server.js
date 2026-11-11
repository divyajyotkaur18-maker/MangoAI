

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
app.use(cors({
  origin: "https://mangoai-ge5p.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Backend health check
app.get("/", (req, res) => {
  res.status(200).send("MangoAI Backend is running!");
});

// Chat API
app.use("/api/chat", chatRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    console.log("MongoDB URI exists:", Boolean(uri));
    console.log("MongoDB URI type:", typeof uri);
    console.log("MongoDB URI prefix:", uri?.slice(0, 15));
    console.log("MongoDB URI length:", uri?.length);

    // Safe connection string diagnostics
    console.log("Has whitespace:", /\s/.test(uri || ""));
    console.log("Has quotation marks:", /["']/.test(uri || ""));
    console.log("Has placeholder brackets:", /[<>]/.test(uri || ""));

    console.log(
      "Valid basic URI structure:",
      /^mongodb\+srv:\/\/[^:/?#]+:[^@/]+@[^/?#]+/.test(uri || "")
    );

    if (!uri) {
      throw new Error("MONGODB_URI is missing in Render Environment");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MangoAI server running on port ${PORT}`);
  connectDB();
});



// Gemini API endpoint
// app.post("/test", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: message
//                 }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       console.error(data);
//       return res.status(response.status).json({
//         error: data
//       });
//     }

//     let reply =
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response received";

//     // 1. Clean bolding asterisks (**) so output starts directly with plain text words
//     reply = reply.replace(/\*\*/g, "");

//     // 2. Send pure raw text so Express does not output a JSON object
//     res.type("text/plain").send(reply);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Something went wrong"
//     });
//   }
// });


