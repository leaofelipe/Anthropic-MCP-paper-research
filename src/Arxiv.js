const axios = require('axios')
const xml2js = require('xml2js')
const FileManager = require('./FileManager.js')

const QUERY_CS_AI = 'cat:cs.AI'
const MAX_RESULTS_DEFAULT = 3

class ArxivClient {
  async search (query = QUERY_CS_AI, maxResults = MAX_RESULTS_DEFAULT) {
    const url = process.env.ARXIV_API_URL
    const params = {
      search_query: query,
      start: 0,
      max_results: maxResults
    }

    const response = await axios.get(url, { params })
    const parser = new xml2js.Parser()
    const result = await parser.parseStringPromise(response.data)
    const papersData = {}
    result.feed.entry?.forEach(entry => {
      const shortID = entry.id[0].split('/abs/')[1]
      papersData[shortID] = {
        title: entry.title[0],
        summary: entry.summary[0],
        authors: entry.author?.map(a => a.name[0]),
        pdf_url: entry.link?.find(link => this.isPdfLink(link.$.href))?.$?.href,
        published: entry.published[0]
      }
    })
    const PAPER_IDS = Object.keys(papersData)
    try {
      await FileManager.saveData(papersData)
      return PAPER_IDS
    } catch (err) {
      throw new Error(err)
    }
  }

  isPdfLink (url) {
    const arxivPdfRegex = /^https:\/\/arxiv\.org\/pdf\/\d{4}\.\d{4,5}(v\d+)?$/
    return arxivPdfRegex.test(url)
  }
}

module.exports = new ArxivClient()
