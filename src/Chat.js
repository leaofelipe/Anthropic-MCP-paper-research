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

  async processQuery(query) {
    this.messages = [{ role: ROLES.USER, content: query }]
    this._isQueryProcessing = true
    const response = await this.anthropic.sendMessage(this.messages)
    let textResponse, toolResponse
    while (this._isQueryProcessing) {
      for (const content of response.content) {
        textResponse = await this.processTextContent(content)
        toolResponse = await this.processToolContent(content)
      }
      if (response.content.length === 1) this._isQueryProcessing = false
      return textResponse || toolResponse || undefined
    }
  }

  async processTextContent(content) {
    if (content.type !== 'text') return
    this._assistantContent.push(content)
    return content.text
  }

  async processToolContent(content) {
    if (content.type !== 'tool_use') return
    this._assistantContent.push(content)
    this.messages.push({
      role: ROLES.ASSISTANT,
      content: this._assistantContent
    })
    const { id: toolId, input: toolArgs, name: toolName } = content
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
      this._isQueryProcessing = false
      return response.content[0].text
    }
  }
}

module.exports = Chat
