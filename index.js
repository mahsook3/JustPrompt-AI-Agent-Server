const express = require("express");
const compileCode = require("./models/compiler");
const { searchQuestions } = require('./models/stackoverflow');
const generateCode = require("./models/aicodegenerator");
const debugCode = require("./models/debug");
const ultraDebug = require("./models/ultradebug");

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 8000;
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
