require('dotenv').config()
const Chat = require('./Chat')

class IO {
  constructor() {
    this.chat = new Chat()
  }

  async start() {
    console.log('Type your query:')
    process.stdin.on('data', async data => {
      const query = data.toString().trim()
      try {
        const response = await this.chat.processQuery(query)
      } catch (error) {
        console.error('Error processing query:', error)
      }
    })
  }
}

const io = new IO()
io.start()
