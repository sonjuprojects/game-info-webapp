import React, { useState } from 'react';

function App() {
  const [game, setGame] = useState('');
  const [data, setData] = useState(null);

  const fetchGameInfo = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game?title=${game}`);
    const result = await response.json();
    setData(result);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Game Info App</h1>
      <input
        type="text"
        value={game}
        onChange={(e) => setGame(e.target.value)}
        placeholder="Enter game name"
      />
      <button onClick={fetchGameInfo}>Search</button>

      {data && (
        <div style={{ marginTop: '1rem' }}>
          <h2>{data.title}</h2>
          <p><strong>Metacritic Score:</strong> {data.metacritic?.score ?? 'N/A'}</p>
          <p><strong>HowLongToBeat:</strong> {data.hltb?.gameplayMain ?? 'N/A'} hours</p>
          <p><strong>Description:</strong> {data.metacritic?.description ?? 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default App;