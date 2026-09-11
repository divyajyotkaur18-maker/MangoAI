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

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database");
  } catch(err){
    console.log("Failed to connect with DB",err);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB();


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


