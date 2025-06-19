const Anthropic = require('./Anthropic')
const executeTool = require('./Tools/executeTool')
const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant'
}

class Chat {
  constructor() {
    this.anthropic = new Anthropic()
    this._isQueryProcessing = false
    this._assistantContent = []
  }

  reset() {
    this._isQueryProcessing = false
    this._assistantContent = []
  }

  async start() {
    console.log('Type your query or "quit" to exit:')
    process.stdin.on('data', async data => {
      const query = data.toString().trim()
      try {
        await this.processQuery(query)
      } catch (error) {
        console.error('Error processing query:', error)
      }
    })
  }

  async processQuery(query) {
    this.messages = [{ role: ROLES.USER, content: query }]
    this._isQueryProcessing = true
    const response = await this.anthropic.sendMessage(this.messages)
    while (this._isQueryProcessing) {
      for (const content of response.content) {
        await this.processTextContent(content)
        await this.processToolContent(content)
      }
      if (response.content.length === 1) this._isQueryProcessing = false
    }
  }

  async processTextContent(content) {
    if (content.type !== 'text') return
    console.log('Response:', content.text)
    this._assistantContent.push(content)
  }

  async processToolContent(content) {
    if (content.type !== 'tool_use') return
    this._assistantContent.push(content)
    this.messages.push({
      role: ROLES.ASSISTANT,
      content: this._assistantContent
    })
    const { id: toolId, input: toolArgs, name: toolName } = content
    console.log(`Calling Tool: ${toolName} (${toolId}) with args:`, toolArgs)
    const toolResponse = await executeTool(toolName, toolArgs)
    this.messages.push({
      role: ROLES.USER,
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolId,
          content: toolResponse
        }
      ]
    })
    const response = await this.anthropic.sendMessage(this.messages, 2024)
    if (response.content.length === 1 && response.content[0].type === 'text') {
      console.log('Response:', response.content[0].text)
      this._isQueryProcessing = false
    }
  }
}

module.exports = Chat
