const ArxivClient = require('../Arxiv')

const TOOL_MAP = {
  search_papers: ArxivClient.search.bind(ArxivClient),
  extract_info: ArxivClient.getDocumentById.bind(ArxivClient)
}

async function executeTool(toolName, args) {
  console.log(`Execute Tool: Calling Tool: ${toolName} with args:`, args)

  const response = await TOOL_MAP[toolName]?.(...Object.values(args))
  if (!response)
    return 'The operation completed but did not return any results.'
  if (Array.isArray(response)) return response.join(', ')
  if (typeof response === 'object') return JSON.stringify(response)
  return String(response)
}

module.exports = executeTool
