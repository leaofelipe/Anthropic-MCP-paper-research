/**
 * Docs:
 *  https://docs.anthropic.com/en/api/messages
 *  https://docs.anthropic.com/en/api/messages-count-tokens
 */
// const MOCK = require('./mocks/text_response_mock.js')
const Anthropic = require('@anthropic-ai/sdk')
const ToolsSchema = require('./Tools/Schema.js') // Schema for tools
const MODEL = 'claude-sonnet-4-20250514'
const MOCK = require('./mocks/text_response_mock.js') // Mock response for testing

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
    // const response = MOCK
    return response
  }
}

module.exports = AnthropicClient
