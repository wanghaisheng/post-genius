import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();
    const dom = new JSDOM(html);
    const title = dom.window.document.querySelector('title')?.textContent || '';

    if (title) {
      res.status(200).json({ title });
    } else {
      res.status(404).json({ error: 'No title found' });
    }
  } catch (error) {
    console.error('Error fetching title:', error);
    res.status(500).json({ error: `Failed to fetch title: ${error.message}` });
  }
}
