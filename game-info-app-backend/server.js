const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

async function scrapeHLTB(title) {
  const searchUrl = `https://howlongtobeat.com/?q=${encodeURIComponent(title)}`;
  const response = await axios.get(searchUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(response.data);
  const firstResult = $('.search_list_details').first();

  if (!firstResult.length) return null;

  const name = firstResult.find('a').text().trim();
  const times = {};

  firstResult.find('.search_list_tidbit').each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes('Main Story')) times.main = text.replace('Main Story', '').trim();
    if (text.includes('Main + Extra')) times.mainExtra = text.replace('Main + Extra', '').trim();
    if (text.includes('Completionist')) times.completionist = text.replace('Completionist', '').trim();
  });

  return { name, ...times };
}

async function scrapeMetacritic(title) {
  const searchUrl = `https://www.metacritic.com/search/game/${encodeURIComponent(title)}/results`;
  const response = await axios.get(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const $ = cheerio.load(response.data);
  const firstLink = $('.search_results .result.first_result a').attr('href');

  if (!firstLink) return null;

  const gamePageUrl = `https://www.metacritic.com${firstLink}`;
  const gamePageRes = await axios.get(gamePageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const $$ = cheerio.load(gamePageRes.data);
  const score = $$('span.metascore_w.xlarge.game').first().text().trim();
  const summary = $$('div.summary_deck span').first().text().trim();

  return {
    url: gamePageUrl,
    score,
    summary
  };
}

app.get('/game', async (req, res) => {
  const title = req.query.title;
  if (!title) return res.status(400).json({ error: 'Game title is required' });

  try {
    console.log(`🔍 Searching HLTB + Metacritic for "${title}"`);

    const [hltbData, metacriticData] = await Promise.all([
      scrapeHLTB(title),
      scrapeMetacritic(title)
    ]);

    res.json({
      title,
      hltb: hltbData || { error: 'No HLTB info found' },
      metacritic: metacriticData || { error: 'No Metacritic info found' }
    });
  } catch (err) {
    console.error('❌ Error in /game route:', err.message);
    res.status(500).json({ error: 'Something went wrong while scraping.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
