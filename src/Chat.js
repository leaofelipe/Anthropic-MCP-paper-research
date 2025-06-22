const Anthropic = require('./Anthropic')
const executeTool = require('./Tools/executeTool')
const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant'
}

class Chat {
  constructor() {
    this.anthropic = new Anthropic()
  }

  reset() {
    this._assistantContent = []
    this._toolResults = []
    this._hasToolUse = false
  }

  getProcessHandler(contentType) {
    const handlers = {
      text: this.processTextContent.bind(this),
      tool_use: this.processToolContent.bind(this)
    }
    return handlers[contentType]
  }

  async handleContentTypes(response) {
    const promises = response.content.map(content => {
      const handler = this.getProcessHandler(content.type)
      return handler ? handler(content) : Promise.resolve()
    })
    await Promise.all(promises)
  }

  async processQuery(query) {
    this.reset()
    this._messages = [{ role: ROLES.USER, content: query }]
    const response = await this.anthropic.sendMessage(this._messages)
    await this.processResponse(response)
  }

  async processResponse(response) {
    await this.handleContentTypes(response)
    if (!this._hasToolUse) return
    this._messages.push({
      role: ROLES.ASSISTANT,
      content: this._assistantContent
    })
    this._messages.push({ role: ROLES.USER, content: this._toolResults })
    this.reset()
    const nextResponse = await this.anthropic.sendMessage(this._messages)
    await this.processResponse(nextResponse)
  }

  async processTextContent(content) {
    this._assistantContent.push(content)
    console.log(content.text)
    return content.text
  }

  async processToolContent(content) {
    this._hasToolUse = true
    this._assistantContent.push(content)
    const { id: toolId, input: toolArgs, name: toolName } = content
    const result = await executeTool(toolName, toolArgs)
    this._toolResults.push({
      type: 'tool_result',
      tool_use_id: toolId,
      content: result
    })
    return result
  }
}

module.exports = Chat
