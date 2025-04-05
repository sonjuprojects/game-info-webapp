import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [gameName, setGameName] = useState('');
  const [gameInfo, setGameInfo] = useState(null);

  const fetchGameInfo = async () => {
    const response = await axios.get(\`http://localhost:3000/game-info?name=\${gameName}\`);
    setGameInfo(response.data);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Game Info Finder</h1>
      <input
        type="text"
        value={gameName}
        onChange={e => setGameName(e.target.value)}
        placeholder="Enter game name"
      />
      <button onClick={fetchGameInfo}>Search</button>

      {gameInfo && (
        <div style={{ marginTop: '2rem' }}>
          <h2>{gameInfo.game}</h2>
          <h3>Metacritic</h3>
          <p>Score: {gameInfo.metacritic.score}</p>
          <p>User Score: {gameInfo.metacritic.userScore}</p>
          <p>{gameInfo.metacritic.summary}</p>

          <h3>How Long To Beat</h3>
          {gameInfo.howlongtobeat ? (
            <ul>
              <li>Main Story: {gameInfo.howlongtobeat.gameplayMain} hrs</li>
              <li>Main + Extra: {gameInfo.howlongtobeat.gameplayMainExtra} hrs</li>
              <li>Completionist: {gameInfo.howlongtobeat.gameplayCompletionist} hrs</li>
            </ul>
          ) : (
            <p>No data found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;