import "dotenv/config";
const getGoggleAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      options
    );

    const data = await response.json();

    let reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received";

    // Clean up markdown bolding
    reply = reply.replace(/\*\*/g, "");

    return reply;
  } catch (err) {
    console.error(err);
    return "Mango AI was unable to process your request. Please try sending your message again.";
  }
};

export default getGoggleAIAPIResponse;