# JustPrompt

JustPrompt is a GenAi powered server application built with Node.js and Express. It provides various endpoints for compiling code, searching StackOverflow questions, generating code, and debugging code using AI models.

Our Gen AI agent capable of converting prompted algorithms into compiled code. The tool should take user-defined algorithms and generate executable code in the desired programming language.

## Key Features

- Input interface for algorithm description
- Translation of algorithms into multiple programming languages
- Code compilation and error checking
- Output of ready-to-use code snippets

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/mahsook3/JustPrompt-AI-Agent-Server
    cd server
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. The server will be running on `http://localhost:8000` by default.

## Endpoints

### Compile Code

- **URL:** `/compile`
- **Method:** `POST`
- **Description:** Compiles the provided code.
- **Request Body:**
    ```json
    {
        "code": "your code here",
        "language": "c|cpp|python|java",
        "input": "input data"
    }
    ```

### Search StackOverflow Questions

- **URL:** `/search`
- **Method:** `POST`
- **Description:** Searches for StackOverflow questions based on the provided query.
- **Request Body:**
    ```json
    {
        "query": "search query"
    }
    ```

### Generate Code

- **URL:** `/generate`
- **Method:** `POST`
- **Description:** Generates code based on the provided language, algorithm, and requirements.
- **Request Body:**
    ```json
    {
        "language": "programming language",
        "algorithm": "algorithm name",
        "requirement": "code requirements",
        "expectedOutput": "expected output (optional)"
    }
    ```

### Debug Code

- **URL:** `/debug`
- **Method:** `POST`
- **Description:** Debugs the provided code and suggests changes to achieve the expected output.
- **Request Body:**
    ```json
    {
        "input": "input data",
        "output": "current output",
        "expectedOutput": "expected output",
        "code": "code to debug"
    }
    ```

### Ultra Debug

- **URL:** `/ultra-debug`
- **Method:** `POST`
- **Description:** Simplifies the error log and searches for solutions on StackOverflow.
- **Request Body:**
    ```json
    {
        "error": "error log"
    }
    ```

## License

This project is licensed under the ISC License.