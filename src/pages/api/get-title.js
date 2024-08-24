import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default function handler(req, res) {
  res.status(200).json({ message: 'API route is working' })
}