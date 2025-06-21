const Chat = require('./Chat')
const FileManager = require('./FileManager')

class IO {
  constructor() {
    this.chat = new Chat()
  }

  async start() {
    console.log('Type your query:')
    process.stdin.on('data', async data => {
      const query = data.toString().trim()
      if (query.toLowerCase() === 'exit') {
        console.log('Exiting...')
        // await FileManager.saveData(
        //   this.chat.chatHistory,
        //   'chat_history.json',
        //   'output'
        // )

        process.exit(0)
      }
      try {
        const response = await this.chat.processQuery(query)
      } catch (error) {
        console.error('Error processing query:', error)
      }
    })
  }
}

module.exports = IO
