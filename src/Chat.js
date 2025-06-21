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
    this._chatHistory = []
    this._messages = []
    this._isQueryProcessing = false
    this._assistantContent = []
    this._toolResults = []
  }

  getProcessHandler(contentType) {
    const handlers = {
      text: this.processTextContent.bind(this),
      tool_use: this.processToolContent.bind(this)
    }
    return handlers[contentType]
  }

  async handleContentTypes(response) {
    for (const content of response.content) {
      await this.getProcessHandler(content.type)?.(content)
    }
  }

  async processQuery(query) {
    this.reset()
    const message = { role: ROLES.USER, content: query }
    this._messages.push(message)
    this._isQueryProcessing = true
    let response = await this.anthropic.sendMessage(this._messages)

    while (this._isQueryProcessing) {
      await this.handleContentTypes(response)

      const hasToolUse = response.content.some(
        content => content.type === 'tool_use'
      )

      if (hasToolUse) {
        this._messages.push({
          role: ROLES.ASSISTANT,
          content: this._assistantContent
        })

        this._messages.push({
          role: ROLES.USER,
          content: this._toolResults
        })

        response = await this.anthropic.sendMessage(this._messages)
      } else {
        this._isQueryProcessing = false
      }
    }
  }

  async processTextContent(content) {
    this._assistantContent.push(content)
    console.log(content.text)
    return content.text
  }

  async processToolContent(content) {
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
