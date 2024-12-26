const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 5000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(cors());
app.use(bodyParser.json());

const debugCode = async (req, res) => {
    const { input, output, expectedOutput, code } = req.body;
    console.log(input, output, expectedOutput, code);

    const prompt = `Here is a piece of code:\n${code}\n\nIt takes the following input: ${input}\nAnd produces the following output: ${output}\n\nThe expected output should be: ${expectedOutput}\n\nPlease provide the changes needed to achieve the expected output as short paragraph and the updated code.Note:write full code`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const regex = /```[\s\S]*?```/;
        const match = text.match(regex);

        const codeContent = match ? match[0].replace(/```[\w]*\n?/, "").replace(/```$/, "").trim() : "No code content found";

        res.json({ changes: text, updatedCode: codeContent });
        console.log(codeContent);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while generating content");
    }
};

module.exports = debugCode;
