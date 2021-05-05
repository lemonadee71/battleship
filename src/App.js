import React, { useState } from 'react';
import Game from './Game';

const App = () => {
  const [mode, setMode] = useState('normal');

  const changeMode = (e) => {
    setMode(e.target.value);
  };

  return (
    <div className="App">
      <h1>Battleship</h1>
      <select name="mode" value={mode} onChange={changeMode}>
        <option value="normal">Normal</option>
        <option value="medium">Intermediate</option>
        <option value="hard">Hard</option>
      </select>
      <Game mode={mode} />
    </div>
  );
};

export default App;
