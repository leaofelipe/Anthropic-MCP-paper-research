import 'dotenv/config'
import ArxivClient from './Arxiv.js'

const QUERY_CS_AI = 'cat:cs.AI'
const MAX_RESULTS_DEFAULT = 3

async function Main () {
  const arxiv = new ArxivClient()

  try {
    const RESPONSE = await arxiv.search(QUERY_CS_AI, MAX_RESULTS_DEFAULT)
    RESPONSE.forEach((entry, index) => {
      console.log(`\nEntry ${index + 1}:`, entry.title)
    })
  } catch (error) {
    console.error('Error fetching data from arXiv:', error.message)
  }
}

Main()
