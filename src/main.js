import 'dotenv/config'
import ArxivClient from './Arxiv.js'
import FileManager from './FileManager.js'

const QUERY_CS_AI = 'cat:cs.AI'
const MAX_RESULTS_DEFAULT = 3

async function Main () {
  const arxiv = new ArxivClient()
  const fileManager = new FileManager()

  try {
    const RESPONSE = await arxiv.search(QUERY_CS_AI, MAX_RESULTS_DEFAULT)
    const RESPONSE_IDS = Object.keys(RESPONSE)
    console.log(RESPONSE_IDS)
    try {
      await fileManager.saveData(RESPONSE)
    } catch (saveError) {
      console.error(saveError.message)
    }
    
  } catch (error) {
    console.error('Error fetching data from arXiv:', error.message)
  }
}

Main()
