const Anthropic = require('@anthropic-ai/sdk')
const ToolsSchema = require('./Tools/Schema.js') // Schema for tools
const MODEL = 'claude-sonnet-4-20250514'

class AnthropicClient {
  get messages() {
    return this._anthropic.messages
  }

  constructor() {
    this._anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })
  }

  async sendMessage(messages, maxTokens = 1024) {
    const response = await this.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      tools: ToolsSchema,
      messages
    })
    return response
  }
}

module.exports = AnthropicClient
