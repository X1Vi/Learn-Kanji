import React, { useState, useEffect } from 'react';
import "../src/index.css";
import KanjiFlashcard from './components/FlashCard';
import KanjiList from './components/KanjiCard';
import Vocabulary from './components/Vocabulary';

const Navbar = ({ currentView, setCurrentView }) => {
  return (
    <nav style={{ backgroundColor: '#333', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
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

        <li>
          <button
            onClick={() => setCurrentView('vocabulary')}
            style={{
              color: currentView === 'vocabulary' ? '#ffcc00' : 'white',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Vocabulary
          </button>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  const [kanjiData, setKanjiData] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'kanji-list'; // Default view
  });

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    fetch("kanji_data_with_romaji_new_test.json")
      .then((response) => response.json())
      .then((data) => setKanjiData(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  return (
    <>
      {kanjiData ? (
      <>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        {currentView === 'flashcard' && <KanjiFlashcard kanjiData={kanjiData} />}
        {currentView === 'kanji-list' && <KanjiList kanjiData={kanjiData} />}
        {currentView === 'vocabulary' && <Vocabulary />}
      </>
      ) : (
      <p>Loading kanji data...</p>
      )}

    </>
  );
}

export default App;