# MCP Paper Research

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-blue.svg)](https://standardjs.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-blue.svg)](https://nodejs.org/)
[![Yarn](https://img.shields.io/badge/yarn-v1.22.21-blue.svg)](https://yarnpkg.com/)

ArXiv Research Assistant MCP

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

## Installation

```bash
yarn install
```

## Configuration

Create a `.env` file in the root directory with your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

## Usage

### Running the MCP Server

To start the MCP server:

```bash
yarn start:server
```

### Running the Inspector

The MCP Inspector allows you to test and debug the MCP server tools in a web interface:

```bash
yarn start:inspector
```

This will:

- Start the MCP server
- Launch the inspector web interface
- Open your browser automatically to interact with the tools

The inspector provides a visual interface where you can:

- View available tools (`search_papers`, `extract_info`)
- Test tool execution with different parameters
- See real-time responses and debug information
- Monitor server logs and errors

### Running the Interactive Chat (IO)

To start the interactive chat interface:

```bash
yarn start:chat
```

This will start an interactive console where you can:

- Type research queries directly
- Get responses from the AI assistant
- Search for papers and extract information automatically

## Available Tools

- **search_papers**: Search for papers on arXiv based on a topic
- **extract_info**: Get detailed information about a specific paper by ID

## Development

### Linting

```bash
yarn lint
```

### Fix linting issues

```bash
yarn lint:fix
```
