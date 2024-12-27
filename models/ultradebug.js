const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const { searchQuestions } = require('./stackoverflow');

const app = express();
const port = 6060;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(bodyParser.json());

const ultraDebug = async (req, res) => {
    const { error } = req.body;
    console.log("Received error:", error);

    let prompt = `Simplify the following error log give only key error with value: ${error}`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const simplifiedErrorLog = text.trim();
        console.log(simplifiedErrorLog);

        // Pass simplifiedErrorLog to searchQuestions
        const searchResults = await searchQuestions(simplifiedErrorLog);

        // Extract only questions and answers from searchResults
        const filteredResults = searchResults.map(result => ({
            question: result.question,
            answers: result.answers
        }));

        // Create a new prompt to summarize the filtered results
        let summaryPrompt = `Summarize the following results to solve the error ${error}: ${JSON.stringify(filteredResults)}`;
        const summaryResult = await model.generateContent(summaryPrompt);
        const summaryResponse = await summaryResult.response;
        const summaryText = await summaryResponse.text();

        const summary = summaryText.trim();
        console.log(summary);

        res.json({ simplifiedErrorLog, searchResults: filteredResults, summary });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while generating content");
    }
};

module.exports = ultraDebug;