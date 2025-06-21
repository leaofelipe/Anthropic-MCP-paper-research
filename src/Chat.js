const Anthropic = require('./Anthropic')
const executeTool = require('./Tools/executeTool')
const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant'
}

class Chat {
  constructor() {
    this.anthropic = new Anthropic()
    this.chatHistory = []
  }

  getProcessHandler(contentType) {
    const handlers = {
      text: this.processTextContent.bind(this),
      tool_use: this.processToolContent.bind(this)
    }
    return (
      handlers[contentType] ||
      (() => {
        throw new Error(`No handler for content type: ${contentType}`)
      })
    )
  }

  async processQuery(query) {
    console.log('==> Process query:', query)
    this.messages = [{ role: ROLES.USER, content: query }]
    this._isQueryProcessing = true
    let response = await this.anthropic.sendMessage(this.messages)

    while (this._isQueryProcessing) {
      this._assistantContent = []
      this._toolResults = []

      for (const content of response.content) {
        const processHandler = this.getProcessHandler(content.type)
        await processHandler(content)
      }

      const hasToolUse = response.content.some(
        content => content.type === 'tool_use'
      )

      if (hasToolUse) {
        this.messages.push({
          role: ROLES.ASSISTANT,
          content: this._assistantContent
        })

        this.messages.push({
          role: ROLES.USER,
          content: this._toolResults
        })

        response = await this.anthropic.sendMessage(this.messages)

        this.messages.push(response)
        this.chatHistory.push(this.messages)
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
