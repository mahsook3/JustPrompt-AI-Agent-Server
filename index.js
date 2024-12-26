const express = require("express");
const cors = require("cors");
const compileCode = require("./compiler");
const { searchQuestions } = require('./stackoverflow');
const generateCode = require("./aicodegenerator");
const debugCode = require("./debug");
const ultraDebug = require("./ultradebug");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post("/compile", compileCode);

app.post('/search', async (req, res) => {
    const query = req.body.query;
    if (!query) {
        return res.status(400).send('Query is required');
    }

    try {
        const results = await searchQuestions(query);
        res.json(results);
    } catch (error) {
        res.status(500).send('An error occurred while searching for questions');
    }
});

app.post("/generate", generateCode);

app.post("/debug", debugCode);

app.post("/ultra-debug", ultraDebug);

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});