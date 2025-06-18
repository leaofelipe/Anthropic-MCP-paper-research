import axios from 'axios'
import xml2js from 'xml2js'

class ArxivClient {
  async search (query, maxResults = 10) {
    const url = process.env.ARXIV_API_URL
    const params = {
      search_query: query,
      start: 0,
      max_results: maxResults
    }

    const response = await axios.get(url, { params })
    const parser = new xml2js.Parser()
    const result = await parser.parseStringPromise(response.data)

    return result.feed.entry?.map(entry => ({
      title: entry.title[0],
      summary: entry.summary[0],
      authors: entry.author?.map(a => a.name[0]),
      pdf_url: entry.link?.find(l => l.$.type === 'application/pdf')?.$?.href,
      published: entry.published[0]
    })) || []
  }
}

export default ArxivClient
