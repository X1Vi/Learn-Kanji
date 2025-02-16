import React, { useState, useEffect } from 'react';
import "../src/index.css";
import KanjiFlashcard from './components/FlashCard';
import KanjiList from './components/KanjiCard';

const Navbar = ({ currentView, setCurrentView }) => {
  return (
    <nav style={{ backgroundColor: '#333', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Kanji Explorer</h1>
      <ul style={{ display: 'flex', gap: '16px', listStyle: 'none', margin: 0, padding: 0 }}>
        <li>
          <button
            onClick={() => setCurrentView('flashcard')}
            style={{
              color: currentView === 'flashcard' ? '#ffcc00' : 'white',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Flashcards
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentView('kanji-list')}
            style={{
              color: currentView === 'kanji-list' ? '#ffcc00' : 'white',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Kanji List
          </button>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  const [kanjiData, setKanjiData] = useState({});
  const [currentView, setCurrentView] = useState('kanji-list'); // Default view

  useEffect(() => {
    fetch("kanji_data_with_romaji_new_test.json")
      .then((response) => response.json())
      .then((data) => setKanjiData(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  return (
    <>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div style={{ padding: '16px' }}>
        {currentView === 'flashcard' && <KanjiFlashcard kanjiData={kanjiData} />}
        {currentView === 'kanji-list' && <KanjiList kanjiData={kanjiData} />}
      </div>
    </>
  );
}

export default App;