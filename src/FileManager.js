const { promises: fs } = require('fs')
const { join } = require('path')

const DATA_DIR = join('.', process.env.DATA_DIRECTORY)
const FILE_NAME = process.env.DATA_FILENAME

class FileManager {
  async ensureDataDirectory() {
    try {
      await fs.stat(DATA_DIR)
      await fs.rm(DATA_DIR, { recursive: true, force: true })
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw new Error(`Error checking data directory: ${err.message}`)
      }
    }

    try {
      await fs.mkdir(DATA_DIR, { recursive: true })
    } catch (err) {
      throw new Error(`Error creating data directory: ${err.message}`)
    }
  }

  async saveData(data, fileName = FILE_NAME, dataDir = DATA_DIR) {
    const filePath = join(dataDir, fileName)
    const jsonData = JSON.stringify(data, null, 2)

    try {
      await this.ensureDataDirectory()
      await fs.writeFile(filePath, jsonData, 'utf8')
    } catch (err) {
      throw new Error(`Error saving file: ${err.message}`)
    }
  }

  async readData() {
    const filePath = join(DATA_DIR, FILE_NAME)
    try {
      const jsonData = await fs.readFile(filePath, 'utf8')
      return JSON.parse(jsonData)
    } catch (err) {
      throw new Error(err)
    }
  }

  async readDataById(paper_id) {
    try {
      const data = await this.readData()
      if (data[paper_id]) return data[paper_id]
      throw new Error(`Data with ID '${paper_id}' not found`)
    } catch (err) {
      throw new Error(`Error reading data by ID: ${err.message}`)
    }
  }
}

module.exports = new FileManager()
