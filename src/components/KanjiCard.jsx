import React, { useState, useEffect, useRef } from "react";
import Masonry from "masonry-layout";
const colors = {
  background: "#121212",
  card: "#1E1E1E",
  textPrimary: "#E0E0E0",
  textSecondary: "#A0A0A0",
  hint: "#BB86FC",
  answer: "#03DAC6",
  button: "#BB86FC",
  border: "#BB86FC",
};

const Card = ({ children }) => (
  <div
    style={{
      padding: "16px",
      textAlign: "center",
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      backgroundColor: colors.card,
      color: colors.textPrimary,
    }}
  >
    {children}
  </div>
);

const MatchingGame = ({ kanji, data, showKanji, kanjiArray, revealAnswers=[], setAllRevealAnswers=null }) => {
  const [selectedJapanese, setSelectedJapanese] = useState(null);
  const [selectedRomaji, setSelectedRomaji] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [localShowKanji, setLocalShowKanji] = useState(true);
  const [kanjiMCQArray, setKanjiMCQArray] = useState([]);
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [revealAnswer, setRevealAnswer] = useState(false);

  const japaneseMeanings = data.readings_on || [];
  const chineseMeanings = data.readings_kun || [];
  const romajiReadings = data.readings_on_romaji || [];
  const more_romajied_readings = data.readings_kun_romaji || [];
  const meanings = data.meanings || [];

  const getRandomKanji = (kanjiArray, count) => {
    const shuffled = [...kanjiArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(([kanji]) => kanji);
  };

  useEffect(() => {
    const randomKanji = getRandomKanji(kanjiArray, 3);
    let incorrectKanjisArray = randomKanji.map((kanji) => ({
      kanji,
      correct: false,
    }));

    incorrectKanjisArray.push({ kanji, correct: true });

    // Shuffle the array so the correct kanji is in a random position
    incorrectKanjisArray = incorrectKanjisArray.sort(() => 0.5 - Math.random());

    setKanjiMCQArray(incorrectKanjisArray);
  }, [kanji]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleMatch = () => {
    if (selectedJapanese && selectedRomaji) {
      const isCorrect =
        (japaneseMeanings.includes(selectedJapanese) &&
          romajiReadings[japaneseMeanings.indexOf(selectedJapanese)] === selectedRomaji) ||
        (chineseMeanings.includes(selectedJapanese) &&
          more_romajied_readings[chineseMeanings.indexOf(selectedJapanese)] === selectedRomaji);
      setFeedback(isCorrect ? "Correct! 🎉" : "Incorrect. Try again! ❌");
      if (isCorrect) {
        setMatchedPairs([...matchedPairs, { selectedJapanese, selectedRomaji }]);
      }
      setSelectedJapanese(null);
      setSelectedRomaji(null);
    }
  };

  useEffect(() => {
    setLocalShowKanji(showKanji);
  }, [showKanji]);

  useEffect(()=>{
    setAllRevealAnswers(prev => [...prev, {revealAnswer, kanji}])
  },[revealAnswer])

  return (
    <Card>
      <button
        onClick={() => setLocalShowKanji(!localShowKanji)}
        style={{
          marginBottom: "8px",
          padding: "8px 16px",
          backgroundColor: showKanji ? colors.button : colors.textSecondary,
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Toggle Kanji
      </button>

      {localShowKanji && (
        <div>
          <h2>Choose the Correct Kanji:</h2>
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap", alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
          }}>
            {kanjiMCQArray.map((kanjiObject) => (
              <button
                key={kanjiObject.kanji}
                onClick={() => setSelectedKanji(kanjiObject.kanji)}
                style={{

                  padding: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  backgroundColor:
                    selectedKanji === kanjiObject.kanji ? (kanjiObject.correct ? "#10b981" : "#ef4444") : colors.button,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {kanjiObject.kanji}
              </button>
            ))}
          </div>
          {revealAnswer && (
            <p style={{ marginTop: "8px", fontSize: "1.2rem", color: "#10b981" }}>
              Correct Kanji: <strong>{kanji}</strong>
            </p>
          )}
          <button
            onClick={() => setRevealAnswer(true)}
            style={{
              marginTop: "8px",
              padding: "8px 16px",
              backgroundColor: colors.textSecondary,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reveal Answer
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px" }}>
        <div>
          <h2>Meanings</h2>
          {meanings.map((meaning, index) => (
            <h2 key={index} style={{ margin: "4px 0", color: colors.textSecondary }}>
              {meaning}
            </h2>
          ))}
        </div>
        <div>
          <h3>Readings</h3>
          {japaneseMeanings.map((japanese, index) => (
            <button
              key={index}
              onClick={() => setSelectedJapanese(japanese)}
              disabled={matchedPairs.some((pair) => pair.selectedJapanese === japanese)}
              style={{
                margin: "4px",
                padding: "8px",
                width: "100%",
                backgroundColor: selectedJapanese === japanese ? colors.answer : colors.button,
              }}
            >
              {japanese}
            </button>
          ))}
        </div>
        <div>
          <h3>Readings</h3>
          {chineseMeanings.map((japanese, index) => (
            <button
              key={index}
              onClick={() => setSelectedJapanese(japanese)}
              disabled={matchedPairs.some((pair) => pair.selectedJapanese === japanese)}
              style={{
                margin: "4px",
                padding: "8px",
                width: "100%",
                backgroundColor: selectedJapanese === japanese ? colors.answer : colors.button,
              }}
            >
              {japanese}
            </button>
          ))}
        </div>
        <div>
          <h3>Furigana Readings</h3>
          {romajiReadings.map((romaji, index) => (
            <button
              key={index}
              onClick={() => setSelectedRomaji(romaji)}
              disabled={matchedPairs.some((pair) => pair.selectedRomaji === romaji)}
              style={{
                margin: "4px",
                padding: "8px",
                width: "100%",
                backgroundColor: selectedRomaji === romaji ? colors.answer : colors.button,
              }}
            >
              {romaji}
            </button>
          ))}

          {more_romajied_readings.map((romaji, index) => (
            <button
              key={index}
              onClick={() => setSelectedRomaji(romaji)}
              disabled={matchedPairs.some((pair) => pair.selectedRomaji === romaji)}
              style={{
                margin: "4px",
                padding: "8px",
                width: "100%",
                backgroundColor: selectedRomaji === romaji ? colors.answer : colors.button,
              }}
            >
              {romaji}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleMatch}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          backgroundColor: colors.button,
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Match
      </button>

      {feedback && (
        <p style={{ marginTop: "8px", color: feedback.includes("Correct") ? "#10b981" : "#ef4444" }}>
          {feedback}
        </p>
      )}
    </Card>
  );
};

const KanjiList = ({ kanjiData = {} }) => {
  const kanjiArray = Object.entries(kanjiData);
  const [page, setPage] = useState(() => parseInt(localStorage.getItem("pageNumberMatchingGame")) || 0);
  const [showKanji, setShowKanji] = useState(true);
  const [filteredKanji, setFilteredKanji] = useState(kanjiArray);
  const itemsPerPage = 10;
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedKanji = filteredKanji.slice(startIndex, endIndex);
  const [allRevealAnswers, setAllRevealAnswers] = useState([]);

  const handleSearch = (searchQuery) => {
    const query = searchQuery.toLowerCase();

    const filteredResults = kanjiArray.filter(([kanji, data]) => {
      return (
        kanji.includes(query) || // Direct match for kanji
        (data.meanings && data.meanings.some(meaning => meaning.toLowerCase().includes(query))) ||
        (data.readings_on && data.readings_on.some(reading => reading.includes(query))) ||
        (data.readings_kun && data.readings_kun.some(reading => reading.includes(query))) ||
        (data.readings_on_romaji && data.readings_on_romaji.some(reading => reading.toLowerCase().includes(query))) ||
        (data.readings_kun_romaji && data.readings_kun_romaji.some(reading => reading.toLowerCase().includes(query)))
      );
    });

    setFilteredKanji(filteredResults);
    setPage(0); // Reset to first page on new search
  };

  const handlePageJump = (event) => {
    const pageNumber = parseInt(event.target.value) - 1;
    if (pageNumber >= 0 && pageNumber < Math.ceil(filteredKanji.length / itemsPerPage)) {
      setPage(pageNumber);
    }
  };

  useEffect(() => {
    localStorage.setItem("pageNumberMatchingGame", page);
  }, [page]);

  const gridRef = useRef(null); // Ref for the grid container

  useEffect(() => {
    if (gridRef.current) {
      const msnry = new Masonry(gridRef.current, {
        itemSelector: ".masonry-item",
        gutter: 32,
        resize: true,
        fitWidth: true,
        transitionDuration: "0.2s",
      });

      // Initial layout
      msnry.layout();

      // Trigger layout after a short delay to ensure all items are rendered
      setTimeout(() => {
        msnry.layout();
      }, 100);

      // Cleanup function to destroy Masonry instance
      return () => {
        msnry.destroy();
      };
    }
  }, [paginatedKanji, allRevealAnswers]);

  return (
    <div style={{ textAlign: "center", paddingTop: "16px", paddingBottom:"16px",  backgroundColor: colors.background }}>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search Kanji"
          onChange={(event) => handleSearch(event.target.value)}
          style={{
            padding: "8px",
            width: "200px",
            marginRight: "8px",
            borderRadius: "4px",
            border: `1px solid ${colors.border}`,
          }}
        />
        <input
          type="number"
          placeholder="Jump to Page"
          onChange={handlePageJump}
          style={{
            padding: "8px",
            width: "100px",
            borderRadius: "4px",
            border: `1px solid ${colors.border}`,
          }}
        />
      </div>
      <button
        onClick={() => setShowKanji(!showKanji)}
        style={{
          marginBottom: "16px",
          padding: "8px 16px",
          backgroundColor: colors.button,
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Toggle Kanji Globally
      </button>
      <div
        ref={gridRef}
        style={{
          padding: "0px",
          justifyContent:'center',
          alignItems:'center',
          alignSelf:'center',
          justifySelf:'center',
          boxSizing: "border-box",
          margin: "0px",
        }}
      >
        {paginatedKanji.map(([kanji, data]) => (
          <div
            key={kanji}
            className="masonry-item"
            style={{
              width: window.innerWidth < 425 ? "300px" : "300px", // Adjust width based on screen size
              marginBottom: "16px", // Spacing between items
            }}
          >
            <MatchingGame
              revealAnswers={allRevealAnswers}
              setAllRevealAnswers={setAllRevealAnswers}
              kanjiArray={kanjiArray}
              kanji={kanji}
              data={data}
              showKanji={showKanji}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          style={{
            marginRight: "8px",
            padding: "8px 16px",
            backgroundColor: colors.button,
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Prev
        </button>
        <span style={{ color: colors.textPrimary }}>{`Page ${page + 1} of ${Math.ceil(filteredKanji.length / itemsPerPage)}`}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={endIndex >= filteredKanji.length}
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            backgroundColor: colors.button,
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default KanjiList;