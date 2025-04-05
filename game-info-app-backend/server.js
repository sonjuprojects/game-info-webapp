const express = require('express');
const cors = require('cors');
const { search } = require('howlongtobeat-api');

const app = express();
app.use(cors());

app.get('/game', async (req, res) => {
  const title = req.query.title;
  if (!title) {
    console.warn('⚠️ No game title provided');
    return res.status(400).json({ error: 'Game title is required' });
  }

  console.log(`🔍 Searching for game: ${title}`);

  try {
    const results = await search(title);

    console.log(`📦 HLTB raw results for "${title}":`, results);

    const game = results.length ? results[0] : null;

    if (!game) {
      console.warn(`❌ No HLTB results found for: ${title}`);
    }

    // Simulated Metacritic data (you can replace with scraper or API later)
    const metacriticData = {
      score: 88,
      review: 'Sample Metacritic review for demo purposes.'
    };

    res.json({
      title,
      metacritic: metacriticData,
      hltb: game || { message: 'No HowLongToBeat info found.' }
    });
  } catch (error) {
    console.error('❌ Server Error in /game route:', error);
    res.status(500).json({ error: 'Something went wrong fetching game info' });
  }
});

// For Render dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
