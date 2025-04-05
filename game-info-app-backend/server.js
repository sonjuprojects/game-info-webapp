const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { HowLongToBeatService } = require('howlongtobeat');
const cors = require('cors');

const app = express();
app.use(cors());

const hltbService = new HowLongToBeatService();

app.get('/game-info', async (req, res) => {
    const gameName = req.query.name;
    if (!gameName) return res.status(400).json({ error: 'Game name required' });

    try {
        const hltbResults = await hltbService.search(gameName);
        const hltb = hltbResults[0] || null;

        const query = gameName.toLowerCase().replace(/ /g, '-');
        const metaUrl = `https://www.metacritic.com/game/${query}`;
        const response = await axios.get(metaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        const metaScore = $('.metascore_w.xlarge.game').first().text().trim();
        const userScore = $('.metascore_w.user.large.game').first().text().trim();
        const summary = $('.summary_detail.product_summary .data').first().text().trim();

        res.json({
            game: gameName,
            metacritic: {
                score: metaScore,
                userScore: userScore,
                summary: summary
            },
            howlongtobeat: hltb
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching game data', details: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});