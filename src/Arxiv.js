import axios from 'axios'
import xml2js from 'xml2js'

class ArxivClient {
  async search (query, maxResults) {
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
    return papersData
  }

  isPdfLink (url) {
    const arxivPdfRegex = /^https:\/\/arxiv\.org\/pdf\/\d{4}\.\d{4,5}(v\d+)?$/
    return arxivPdfRegex.test(url)
  }
}

export default ArxivClient
