require('dotenv').config()
const { z } = require('zod')
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js')
const {
  StdioServerTransport
} = require('@modelcontextprotocol/sdk/server/stdio.js')
const ArxivClient = require('../Arxiv')

const server = new McpServer({
  name: 'research',
  version: '0.1.0'
})

server.registerTool(
  'search_papers',
  {
    title: 'Search Papers',
    description:
      'Search for papers on arXiv based on a topic and store their information.',
    inputSchema: {
      topic: z.string(),
      max_results: z.number().optional()
    }
  },
  async ({ topic, max_results = 5 }) => {
    const results = await ArxivClient.search(topic, max_results)
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results)
        }
      ]
    }
  }
)

server.registerTool(
  'extract_info',
  {
    title: 'Extract Paper Info',
    description: 'Get details of a specific research paper by ID',
    inputSchema: {
      paper_id: z.string()
    }
  },
  async ({ paper_id }) => {
    const paper = await ArxivClient.getDocumentById(paper_id)
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(paper)
        }
      ]
    }
  }
)

const transport = new StdioServerTransport()
server.connect(transport)
