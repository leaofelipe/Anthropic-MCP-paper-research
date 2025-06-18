import { promises as fs } from 'fs'
import { join } from 'path'

const DATA_DIR = join('.', process.env.DATA_DIRECTORY)
const FILE_NAME = process.env.DATA_FILENAME

console.log(`Data directory: ${DATA_DIR}`)

class FileManager {
  async ensureDataDirectory () {
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

  async saveToJson (data) {
    const filePath = join(DATA_DIR, FILE_NAME)
    const jsonData = JSON.stringify(data, null, 2)
    
    try {
      await fs.writeFile(filePath, jsonData, 'utf8')
      return filePath
    } catch (err) {
      throw new Error(`Error saving file: ${err.message}`)
    }
  }
}

export default FileManager
