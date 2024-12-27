const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = 5000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(bodyParser.json());

const debugCode = async (req, res) => {
    const { input, output, expectedOutput, code,summary } = req.body;

    const prompt = `Here is a piece of code:\n${code} It takes the following input: ${input} And produces the following output: ${output} The expected output should be: ${expectedOutput} also you can refer bellow reference ${summary} Please provide the changes needed to achieve the expected output as short paragraph and the updated code.Note:write full code`;

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
