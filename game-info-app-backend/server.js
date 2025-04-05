const express = require('express');
const cors = require('cors');
const { HowLongToBeatService } = require('howlongtobeat');

const app = express();
app.use(cors());

app.get('/game', async (req, res) => {
  const title = req.query.title;
  if (!title) {
    return res.status(400).json({ error: 'Game title is required' });
  }

  try {
    // HowLongToBeat search
    const hltbService = new HowLongToBeatService();
    const hltbResults = await hltbService.search(title);
    const game = hltbResults.length ? hltbResults[0] : null;

    // Simulated Metacritic data for now
    const metacriticData = {
      score: 88,
      review: 'Great action and storytelling. Sample Metacritic review.'
    };

    res.json({
      title,
      metacritic: metacriticData,
      hltb: game
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Dynamic port + 0.0.0.0 binding for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
