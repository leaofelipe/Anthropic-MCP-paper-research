/**
 * Docs:
 *  https://docs.anthropic.com/en/api/messages
 *  https://docs.anthropic.com/en/api/messages-count-tokens
 */
// const MOCK = require('./mocks/text_response_mock.js')
const Anthropic = require('@anthropic-ai/sdk')
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

  async sendMessage(messages) {
    const response = await this.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages
    })
    return response
  }
}

module.exports = AnthropicClient
