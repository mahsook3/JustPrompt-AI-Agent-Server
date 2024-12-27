const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require('dotenv').config();

const app = express();
const port = 4000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.use(bodyParser.json());

const generateCode = async (req, res) => {
    const { language, algorithm, requirement, expectedOutput } = req.body;
    console.log(language, algorithm, requirement, expectedOutput);

    let prompt = `Generate ${language} code that uses ${algorithm} algorithm. The code should meet the following requirement: ${requirement}.`;
    if (expectedOutput) {
        prompt += ` The expected output is: ${expectedOutput}.`;
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
            messages: [{ "role": "user", "content": prompt }],
            temperature: 0.5,
            top_p: 1,
            max_tokens: 1024,
            stream: false,
        });

        const text = completion.choices[0]?.message?.content || "No code content found";

        const regex = /```[\s\S]*?```/;
        const match = text.match(regex);

        const codeContent = match ? match[0].replace(/```[\w]*\n?/, "").replace(/```$/, "").trim() : "No code content found";

        res.json({ code: codeContent });
        console.log(codeContent);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while generating content");
    }
};

module.exports = generateCode;
