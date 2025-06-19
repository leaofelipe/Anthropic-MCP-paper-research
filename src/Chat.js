const Anthropic = require('./Anthropic')
const ROLES = {
  USER: 'user'
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
      }
      if (response.content.length === 1) this._isQueryProcessing = false
    }
  }

  async processTextContent(content) {
    if (content.type !== 'text') return
    console.log('Response:', content.text)
    this._assistantContent.push(content)
  }
}

module.exports = Chat
