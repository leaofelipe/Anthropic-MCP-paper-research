const Tools = [
  {
    name: 'search_papers',
    description:
      'Search for papers on arXiv based on a topic and store their information.',
    input_schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'The topic to search for'
        },
        max_results: {
          type: 'integer',
          description: 'Maximum number of results to retrieve',
          default: 5
        }
      },
      required: ['topic']
    }
  },
  {
    name: 'extract_info',
    description:
      'Search for information about a specific paper across all topic directories.',
    input_schema: {
      type: 'object',
      properties: {
        paper_id: {
          type: 'string',
          description: 'The ID of the paper to look for'
        }
      },
      required: ['paper_id']
    }
  }
]

module.exports = Tools
