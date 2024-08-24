import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `HTTP error! status: ${response.status}` })
    }

    if (!contentType || !contentType.includes('text/html')) {
      return res.status(415).json({ error: `Unexpected content type: ${contentType}` })
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const title = dom.window.document.querySelector('title')?.textContent || ''

    if (!title) {
      return res.status(404).json({ error: 'No title found' })
    }

    res.status(200).json({ title })
  } catch (error) {
    console.error('Error fetching title:', error)
    res.status(500).json({ error: `Failed to fetch title: ${error.message}` })
  }
}