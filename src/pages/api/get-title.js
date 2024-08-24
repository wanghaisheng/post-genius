import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const dom = new JSDOM(html)
    const title = dom.window.document.querySelector('title')?.textContent || ''

    res.status(200).json({ title })
  } catch (error) {
    console.error('Error fetching title:', error)
    res.status(500).json({ error: 'Failed to fetch title' })
  }
}