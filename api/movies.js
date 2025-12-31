// Vercel Serverless Function for scraping box office data
import axios from 'axios';
import * as cheerio from 'cheerio';

// In-memory cache (persists during serverless function lifetime)
let cache = {
  data: null,
  timestamp: 0,
  CACHE_DURATION: 6 * 60 * 60 * 1000 // 6 hours
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check cache
    const now = Date.now();
    if (cache.data && (now - cache.timestamp) < cache.CACHE_DURATION) {
      console.log('Returning cached data');
      return res.status(200).json({
        data: cache.data,
        cached: true,
        lastUpdated: new Date(cache.timestamp).toISOString()
      });
    }

    console.log('Fetching fresh data from Sacnilk...');
    
    // Scrape Sacnilk for top Bollywood movies
    const response = await axios.get('https://www.sacnilk.com/articles/Bollywood_100crores_Collection_Club_Movies', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const movies = [];

    // Parse the table
    $('table tbody tr').each((index, element) => {
      const cols = $(element).find('td');
      if (cols.length >= 4) {
        const rank = $(cols[0]).text().trim();
        const title = $(cols[1]).text().trim();
        const collection = $(cols[2]).text().trim();
        const year = $(cols[3]).text().trim();

        if (title && collection) {
          movies.push({
            id: index + 1,
            rank: parseInt(rank) || index + 1,
            title: title,
            collection: collection,
            year: year,
            // Generate mock daily collections (will be replaced with real scraping)
            dailyCollections: generateMockDailyCollections(collection)
          });
        }
      }
    });

    // Update cache
    cache.data = movies.slice(0, 100); // Top 100 movies
    cache.timestamp = now;

    return res.status(200).json({
      data: cache.data,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
      source: 'Sacnilk.com'
    });

  } catch (error) {
    console.error('Scraping error:', error.message);
    
    // Return cached data if available even if scraping fails
    if (cache.data) {
      return res.status(200).json({
        data: cache.data,
        cached: true,
        error: 'Using cached data due to scraping error',
        lastUpdated: new Date(cache.timestamp).toISOString()
      });
    }

    return res.status(500).json({
      error: 'Failed to fetch box office data',
      message: error.message
    });
  }
}

// Helper function to generate mock daily collections
function generateMockDailyCollections(totalCollection) {
  // Extract number from collection string (e.g., "917.00 Cr" -> 917)
  const total = parseFloat(totalCollection.replace(/[^0-9.]/g, '')) || 0;
  
  const days = [];
  let remaining = total;
  
  // Generate 30 days of collections with realistic decay
  for (let i = 1; i <= 30 && remaining > 0; i++) {
    let dayCollection;
    if (i === 1) {
      dayCollection = total * 0.25; // Day 1: 25% of total
    } else if (i === 2) {
      dayCollection = total * 0.15; // Day 2: 15%
    } else if (i === 3) {
      dayCollection = total * 0.12; // Day 3: 12%
    } else if (i <= 7) {
      dayCollection = total * (0.08 - (i - 4) * 0.01); // Week 1
    } else {
      dayCollection = remaining / (31 - i); // Distribute rest
    }
    
    dayCollection = Math.max(dayCollection, 0);
    remaining -= dayCollection;
    
    days.push({
      day: i,
      date: `Day ${i}`,
      collection: dayCollection.toFixed(2),
      cumulativeCollection: (total - remaining).toFixed(2)
    });
  }
  
  return days;
}
