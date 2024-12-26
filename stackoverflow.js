const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;

app.use(express.json());

const searchQuestions = async (query) => {
    try {
        console.log(`Searching for questions with query: ${query}`);
        
        // Search for questions
        const searchResponse = await axios.get('https://api.stackexchange.com/2.3/search', {
            params: {
                order: 'desc',
                sort: 'relevance',
                intitle: query,
                site: 'stackoverflow'
            }
        });

        console.log('Search response received');
        const questions = searchResponse.data.items;

        if (questions.length === 0) {
            console.log('No exact questions found. Searching for similar questions...');
            
            // Search for similar questions
            const similarResponse = await axios.get('https://api.stackexchange.com/2.3/similar', {
                params: {
                    order: 'desc',
                    sort: 'relevance',
                    title: query,
                    site: 'stackoverflow'
                }
            });

            console.log('Similar questions response received');
            const similarQuestions = similarResponse.data.items;

            if (similarQuestions.length === 0) {
                console.log('No similar questions found');
                return [];
            }

            const results = [];
            for (const question of similarQuestions) {
                console.log(`Similar Question: ${question.title}`);
                console.log(`Link: ${question.link}`);

                // Get answers for each similar question
                const answersResponse = await axios.get(`https://api.stackexchange.com/2.3/questions/${question.question_id}/answers`, {
                    params: {
                        order: 'desc',
                        sort: 'activity',
                        site: 'stackoverflow',
                        filter: 'withbody'
                    }
                });

                console.log('Answers response received for similar question');
                const answers = answersResponse.data.items;

                if (answers.length === 0) {
                    console.log('No answers found for similar question');
                    continue;
                }

                results.push({
                    question: question.title,
                    link: question.link,
                    answers: answers.map(answer => ({
                        body: answer.body,
                        link: `https://stackoverflow.com/a/${answer.answer_id}`
                    }))
                });
            }

            return results;
        }

        const results = [];
        for (const question of questions) {
            console.log(`Question: ${question.title}`);
            console.log(`Link: ${question.link}`);

            // Get answers for each question
            const answersResponse = await axios.get(`https://api.stackexchange.com/2.3/questions/${question.question_id}/answers`, {
                params: {
                    order: 'desc',
                    sort: 'activity',
                    site: 'stackoverflow',
                    filter: 'withbody'
                }
            });

            const answers = answersResponse.data.items;

            if (answers.length === 0) {
                console.log('No answers found');
                continue;
            }

            results.push({
                question: question.title,
                link: question.link,
                answers: answers.map(answer => ({
                    body: answer.body,
                    link: `https://stackoverflow.com/a/${answer.answer_id}`
                }))
            });
        }

        return results;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

module.exports = { searchQuestions };