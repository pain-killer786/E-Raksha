require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());  // Allow Frontend Requests

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        const apikey = process.env.GEMINI_API_KEY;

        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            });

        // Extract the bot's response from Gemini API
        const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response from Gemini API";

        res.json({ response: botResponse });
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

