import React, { useState, useEffect } from "react";

const colors = {
  background: "#0A041A",
  card: "#1E1A2F",
  textPrimary: "#FFFFFF",
  textSecondary: "#BBBBBB",
  hint: "#6A5ACD",
  answer: "#00FF88",
  button: "#6A5ACD",
  border: "#6A5ACD",
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

const MatchingGame = ({ kanji, data, showKanji }) => {
  const [selectedJapanese, setSelectedJapanese] = useState(null);
  const [selectedRomaji, setSelectedRomaji] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [localShowKanji, setLocalShowKanji] = useState(true);

  const japaneseMeanings = data.readings_on || [];
  const romajiReadings = data.readings_on_romaji || [];
  const meanings = data.meanings || [];
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleMatch = () => {
    if (selectedJapanese && selectedRomaji) {
      const isCorrect =
        japaneseMeanings.includes(selectedJapanese) &&
        romajiReadings[japaneseMeanings.indexOf(selectedJapanese)] === selectedRomaji;
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
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "8px" }}>{kanji}</h2>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px" }}>
        <div>
            <h2>Meanings</h2>

            {meanings.map((meaning, index) => (
                <p key={index} style={{ margin: "4px 0", color: colors.textSecondary }}>
                    {meaning}
                </p>
            ))}

          <h3>Japanese Readings (Kanji)</h3>
          {japaneseMeanings.map((japanese, index) => (
            <button
              key={index}
              onClick={() => setSelectedJapanese(japanese)}
              disabled={matchedPairs.some(pair => pair.selectedJapanese === japanese)}
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
          <h3>Romaji Readings</h3>
          {romajiReadings.map((romaji, index) => (
            <button
              key={index}
              onClick={() => setSelectedRomaji(romaji)}
              disabled={matchedPairs.some(pair => pair.selectedRomaji === romaji)}
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

  return (
    <div style={{ textAlign: "center", padding: "16px", backgroundColor: colors.background }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
        {paginatedKanji.map(([kanji, data]) => (
          <MatchingGame key={kanji} kanji={kanji} data={data} showKanji={showKanji} />
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