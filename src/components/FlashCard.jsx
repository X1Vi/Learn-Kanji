import { useState, useEffect, useRef } from "react";
import JapaneseKeyboard from "./JapeneseKeyboard";

export default function KanjiFlashcard() {
  const [kanjiData, setKanjiData] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(localStorage.getItem("lastIndex")) || 0);
  const [range, setRange] = useState(() => JSON.parse(localStorage.getItem("range")) || [0, 50]);
  const [searchQuery, setSearchQuery] = useState("");
  const [_meaning, setMeaning] = useState("");
  const enterMeaningRef = useRef(null);
  const [failedKanji, setFailedKanji] = useState(() => {
    const storedFailedKanji = localStorage.getItem("failedKanji");
    return storedFailedKanji ? JSON.parse(storedFailedKanji) : [];
  });
  const [showFailedOnly, setShowFailedOnly] = useState(false);
  const checkFurinagaRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [toggleAnswer, setToggleAnswer] = useState(localStorage.getItem("toggleAnswer") === "true");
  const [showReadings, setShowReadings] = useState(localStorage.getItem("showReadings") === "true");

  useEffect(() => {
    localStorage.setItem("toggleAnswer", toggleAnswer.toString());
  }, [toggleAnswer])

  useEffect(() => {
    localStorage.setItem("showReadings", showReadings.toString());
  }, [showReadings])
  
  useEffect(() => {
    if (showFailedOnly) {
      localStorage.setItem("lastNonFailedKanjiIndex", currentIndex);
      setCurrentIndex(0);
    } else if (!showFailedOnly) {
      if (localStorage.getItem("lastIndex") !== null) {
        setCurrentIndex(parseInt(localStorage.getItem("lastIndex")));
      }
    }

  }, [showFailedOnly]);

  useEffect(() => {
    fetch("kanji_data_with_romaji_new_test.json")
      .then((response) => response.json())
      .then((data) => setKanjiData(Object.entries(data)))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("range", JSON.stringify(range));
  }, [range]);

  useEffect(() => {
    localStorage.setItem("lastIndex", currentIndex);
  }, [currentIndex])

  useEffect(() => {
  localStorage.setItem("failedKanji", JSON.stringify(failedKanji));
}, [failedKanji]);

if (!kanjiData) {
  return <p style={{ fontSize: "24px", textAlign: "center", marginTop: "20px", color: "#fff" }}>Loading...</p>;
}

const filteredKanji = kanjiData.filter(([kanji, data]) => {
  const matchesSearch = kanji.includes(searchQuery) ||
    data.meanings.some(meaning => meaning.toLowerCase().includes(searchQuery.toLowerCase()));

  if (showFailedOnly) {
    return matchesSearch && failedKanji.includes(kanji);
  }
  return matchesSearch;
});

const [kanji, data] = filteredKanji[currentIndex] || ["", {}];

const checkMeaning = () => {
  const isCorrect = data.meanings.some(meaning => _meaning.toLowerCase() === meaning.toLowerCase());
  if (isCorrect) {
    // setFailedKanji(failedKanji.filter(k => k !== kanji));
  } else {
    setFailedKanji([...failedKanji, kanji]);
  }
  return isCorrect;
};

const nextKanji = () => {
  if (filteredKanji[filteredKanji.length - 1] === filteredKanji[currentIndex]) {
    return;
  }
  setShowAnswer(false);
  setShowHint(false);
  setCurrentIndex((prevIndex) => {
    const [start, end] = range;
    return prevIndex + 1 >= filteredKanji.length ? start : prevIndex + 1;
  });
  if (enterMeaningRef.current) {
    enterMeaningRef.current.value = "";
  }
};

const prevKanji = () => {
  if (isNaN(currentIndex)) {
    if(localStorage.getItem('lastIndex') !== null) {
      setCurrentIndex(parseInt(localStorage.getItem('lastIndex')));
    }
    else{
      setCurrentIndex(0);
    }
    return;
  }

  if (kanjiData[currentIndex] === kanjiData[0]) {
    return;
  }

  setShowAnswer(false);
  setShowHint(false);
  setCurrentIndex((prevIndex) => {
    const [start, end] = range;
    return prevIndex - 1 < start ? end : prevIndex - 1;
  });
};

const handleRangeChange = (e) => {
  const newRange = e.target.value.split("-").map(Number);
  setRange(newRange);
  setCurrentIndex(newRange[0]);
};

const popKanji = () => {
  setFailedKanji(failedKanji.filter((k) => k !== kanji));
};

const popAllKanji = () => {
  setFailedKanji([]);
}

const checkFurinaga = (showToastBool = false) => {
  const furigana = checkFurinagaRef.current.value;
  const isFuriganaCorrect = data.readings_on_romaji?.map(r => r.toLowerCase()).includes(furigana.toLowerCase()) || data.readings_kun_romaji?.map(r => r.toLowerCase()).includes(furigana.toLowerCase());
  if (showToastBool) {
    showToast(isFuriganaCorrect ? "Correct Furigana" : "Incorrect Furigana", isFuriganaCorrect ? "#00ff88" : "#ff4444");
  }
  return isFuriganaCorrect;
}
const handleKeyPressFurigana = (e) => {
  if (e.code === "ShiftLeft") {
    if (!failedKanji.includes(kanji)) { // Avoid adding duplicates
      setFailedKanji([...failedKanji, kanji]); // Add the current Kanji to the failed list
      showToast("Marked as Failed", "#ff4444"); // Show a toast notification
    }
    setShowAnswer(true);
  }

  if (e.key === "Enter") {
    if (checkFurinaga()) {
      nextKanji();
      showToast("Correct", "#00ff88");
    } else {
      showToast("Incorrect", "#ff4444");
    }
  }
};

const handleKeyPress = (e) => {
  if (e.code === "ShiftLeft") {
    if (!failedKanji.includes(kanji)) { // Avoid adding duplicates
      setFailedKanji([...failedKanji, kanji]); // Add the current Kanji to the failed list
      showToast("Marked as Failed", "#ff4444"); // Show a toast notification
    }
    setShowAnswer(true);
  }

  if (e.key === "Enter") {
    if (checkMeaning()) {
      nextKanji();
      showToast("Correct", "#00ff88");
    } else {
      showToast("Incorrect", "#ff4444");
    }
  }
};


const showToast = (message, backgroundColor) => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = backgroundColor;
  toast.style.color = "#fff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.5s";
    toast.style.opacity = 0;
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 2000);
};

const colors = {
  background: "#0A041A", // Dark purple background
  card: "#1E1A2F", // Dark purple card
  textPrimary: "#FFFFFF",
  textSecondary: "#BBBBBB",
  hint: "#6A5ACD", // Slate blue for hints
  answer: "#00FF88", // Bright green for answers
  buttonHint: "#1E1A2F", // Dark slate blue for hint button
  buttonAnswer: "#1E1A2F", // Dark green for answer button
  buttonNext: "#1E1A2F", // Dark orange for next button
  buttonPrev: "#1E1A2F", // Dark brown for previous button
  border: "#6A5ACD", // Purple border
  glow: "rgba(106, 90, 205, 0.5)", // Glow effect
};

return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${colors.background}, #000000)`,
      color: colors.textPrimary,
      padding: "20px",
      boxSizing: "border-box",
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search by kanji or meaning"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
          background: "#1E1A2F",
          color: "#fff",
          fontSize: "clamp(14px, 4vw, 16px)",
          width: "100%",
          maxWidth: "400px",
          outline: "none",
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />



      <input
        type="text"
        placeholder="Enter number to jump on that kanji (e.g. 0-50)"
        onBlur={handleRangeChange}
        style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
          background: "#1E1A2F",
          color: "#fff",
          fontSize: "clamp(14px, 4vw, 16px)",
          width: "100%",
          maxWidth: "400px",
          outline: "none",
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />
      <button
        style={{
          padding: "14px 24px",
          background: showFailedOnly ? "#FF4444" : "#00FF88",
          color: "white",
          borderRadius: "8px",
          marginBottom: "16px",
          transition: "background 0.3s, transform 0.2s",
          width: "100%",
          maxWidth: "400px",
          fontSize: "clamp(14px, 4vw, 16px)",
          fontWeight: "bold",
          cursor: "pointer",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 8px ${colors.glow}`,
          ":hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={() => {
          setShowFailedOnly(!showFailedOnly);
          showFailedOnly ? setCurrentIndex(0) : null;
        }}
      >
        {showFailedOnly ? "Show All Kanji" : "Show Failed Kanji Only"}
      </button>

      <p
        style={{
          fontSize: "clamp(16px, 4vw, 18px)",
          color: colors.textSecondary,
          marginBottom: "8px",
          zIndex: 2,
        }}
      >
        Current: {currentIndex + 1} / {filteredKanji.length}
      </p>
    </div>
    <div
      style={{
        padding: "clamp(16px, 5vw, 32px)",
        width: "100%",
        maxWidth: "600px",
        textAlign: "center",
        border: `2px solid ${colors.border}`,
        borderRadius: "16px",
        background: colors.card,
        boxShadow: `0 6px 15px ${colors.glow}`,
        transition: "all 0.3s ease-in-out",
        transform: showAnswer ? "scale(1.05)" : "scale(1)",


      }}
    >

      <button
        style={{
          padding: "14px 24px",
          background: colors.buttonHint,
          color: "white",
          borderRadius: "8px",
          transition: "background 0.3s, transform 0.2s",
          fontSize: "clamp(14px, 4vw, 16px)",
          fontWeight: "bold",
          cursor: "pointer",
          flex: "1 1 45%",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 8px ${colors.glow}`,
          ":hover": {
            transform: "scale(1.05)",
          },
          marginRight: "4px"
        }}
        onClick={() => setShowReadings(!showReadings)}
      >
        {showReadings ? "Hide Readings" : "Show Readings"}
      </button>

      <button
        style={{
          padding: "14px 24px",
          background: colors.buttonHint,
          color: "white",
          borderRadius: "8px",
          transition: "background 0.3s, transform 0.2s",
          fontSize: "clamp(14px, 4vw, 16px)",
          fontWeight: "bold",
          cursor: "pointer",
          flex: "1 1 45%",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 8px ${colors.glow}`,
          ":hover": {
            transform: "scale(1.05)",
          },
          marginLeft: "4px"
        }}
        onClick={() => setToggleAnswer(!toggleAnswer)}
      >
        {toggleAnswer ? "Hide Answer Globally" : "Show Answer Globally"}
      </button>

      <h1
        style={{
          fontSize: "clamp(48px, 10vw, 64px)",
          fontWeight: "bold",
          marginBottom: "20px",
          color: colors.textPrimary,
          transition: "0.3s",
          textShadow: `0 0 10px ${colors.glow}`,
        }}
      >
        {kanji}
      </h1>
      <p style={{ color: colors.textSecondary, fontSize: "clamp(16px, 4vw, 22px)" }}>
        {data.strokes} stroke(s)
      </p>

      {showReadings ? <>
        <p style={{ color: colors.textSecondary, fontSize: "clamp(14px, 4vw, 20px)" }}>
          On'yomi (Chinese reading): {data.readings_on?.join(", ")} ({data.readings_on_romaji?.join(", ")})
        </p>
        <p style={{ color: colors.textSecondary, fontSize: "clamp(14px, 4vw, 20px)" }}>
          Kun'yomi (Japanese reading): {data.readings_kun?.join(", ")} ({data.readings_kun_romaji?.join(", ")})
        </p>
      </> : null}

      {showHint && (
        <p style={{ color: colors.hint, fontSize: "clamp(14px, 4vw, 20px)", fontStyle: "italic" }}>
          Hint: {data.wk_radicals?.join(", ")}
        </p>
      )}
      {showAnswer || toggleAnswer ? (
        <p style={{ color: colors.answer, fontSize: "clamp(18px, 5vw, 24px)", fontWeight: "bold" }}>
          Meaning: {data.meanings?.join(", ")}
        </p>
      ) : (
        <p style={{ color: colors.textSecondary, fontSize: "clamp(14px, 4vw, 20px)" }}>
          Do you know the meaning?
        </p>
      )}

      <input
        ref={checkFurinagaRef}
        type="text"
        placeholder="Enter furigana"
        onKeyDown={handleKeyPressFurigana}
        style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
          background: "#1E1A2F",
          color: "#fff",
          fontSize: "clamp(14px, 4vw, 16px)",
          width: "80%",
          maxWidth: "400px",
          outline: "none",
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />
      <button
        style={{
          padding: "14px 24px",
          background: colors.buttonHint,
          color: "white",
          borderRadius: "8px",
          marginBottom: "16px",
          transition: "background 0.3s, transform 0.2s",
          width: "100%",
          maxWidth: "400px",
          fontSize: "clamp(14px, 4vw, 16px)",
          fontWeight: "bold",
          cursor: "pointer",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 8px ${colors.glow}`,
          ":hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={() => {
          if(checkFurinaga()){
            nextKanji()
            showToast(checkFurinaga() ? "Correct" : "Incorrect", checkFurinaga() ? "#00ff88" : "#ff4444");
          }
          else{
            showToast(checkFurinaga() ? "Correct" : "Incorrect", checkFurinaga() ? "#00ff88" : "#ff4444");
          }
        }}
      >
        Check Furigana
      </button>
      <input
        ref={enterMeaningRef}
        placeholder="Enter Meaning"
        onChange={(value) => {
          setMeaning(value.target.value);
        }}
        onKeyDown={handleKeyPress}
        style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
          background: "#1E1A2F",
          color: "#fff",
          fontSize: "clamp(14px, 4vw, 16px)",
          width: "80%",
          maxWidth: "400px",
          outline: "none",
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />
      <button
        style={{
          padding: "14px 24px",
          background: colors.buttonHint,
          color: "white",
          borderRadius: "8px",
          marginBottom: "16px",
          transition: "background 0.3s, transform 0.2s",
          width: "100%",
          maxWidth: "400px",
          fontSize: "clamp(14px, 4vw, 16px)",
          fontWeight: "bold",
          cursor: "pointer",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 8px ${colors.glow}`,
          ":hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={() => {
          const isCorrect = checkMeaning();
          showToast(isCorrect ? "Correct" : "Incorrect", isCorrect ? "#00ff88" : "#ff4444");
        }}
      >
        Check Meaning
      </button>
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            padding: "14px 24px",
            background: colors.buttonHint,
            color: "white",
            borderRadius: "8px",
            transition: "background 0.3s, transform 0.2s",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "bold",
            cursor: "pointer",
            flex: "1 1 45%",
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 8px ${colors.glow}`,
            ":hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => setShowHint(true)}
        >
          Hint
        </button>
        <button
          style={{
            padding: "14px 24px",
            background: colors.buttonAnswer,
            color: "white",
            borderRadius: "8px",
            transition: "background 0.3s, transform 0.2s",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "bold",
            cursor: "pointer",
            flex: "1 1 45%",
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 8px ${colors.glow}`,
            ":hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => {
            setShowAnswer(true);
            setFailedKanji([...failedKanji, kanji]); // Add the current Kanji to the failed list
          }}
        >
          Show Answer
        </button>
        <button
          onClick={prevKanji}
          style={{
            padding: "14px 24px",
            background: colors.buttonPrev,
            color: "white",
            borderRadius: "8px",
            transition: "background 0.3s, transform 0.2s",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "bold",
            cursor: "pointer",
            flex: "1 1 45%",
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 8px ${colors.glow}`,
            ":hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          Previous
        </button>
        <button
          onClick={nextKanji}
          style={{
            padding: "14px 24px",
            background: colors.buttonNext,
            color: "white",
            borderRadius: "8px",
            transition: "background 0.3s, transform 0.2s",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "bold",
            cursor: "pointer",
            flex: "1 1 45%",
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 8px ${colors.glow}`,
            ":hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          Next
        </button>
        {showFailedOnly ?
          <>
            <button
              onClick={popAllKanji}
              style={{
                padding: "14px 24px",
                background: colors.buttonNext,
                color: "white",
                borderRadius: "8px",
                transition: "background 0.3s, transform 0.2s",
                fontSize: "clamp(14px, 4vw, 16px)",
                fontWeight: "bold",
                cursor: "pointer",
                flex: "1 1 45%",
                border: `1px solid ${colors.border}`,
                boxShadow: `0 0 8px ${colors.glow}`,
                ":hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Pop All Failed Kanji
            </button>

            <button
              onClick={popKanji}
              style={{
                padding: "14px 24px",
                background: colors.buttonNext,
                color: "white",
                borderRadius: "8px",
                transition: "background 0.3s, transform 0.2s",
                fontSize: "clamp(14px, 4vw, 16px)",
                fontWeight: "bold",
                cursor: "pointer",
                flex: "1 1 45%",
                border: `1px solid ${colors.border}`,
                boxShadow: `0 0 8px ${colors.glow}`,
                ":hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Pop Current Kanji
            </button>
          </>
          : null}

      </div>
      <button
        style={{
          padding: "14px 24px",
          background: colors.buttonHint,
          color: "white",
          borderRadius: "8px",
          marginTop: "16px",
          transition: "background 0.3s, transform 0.2s",
          width: "100%",
          maxWidth: "400px",
          fontSize: "clamp(14px, 4vw, 16px)",
          fontWeight: "bold",
          cursor: "pointer",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 8px ${colors.glow}`,
          ":hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={() => setShowKeyboard(true)}
      >
        Show Japanese Keyboard
      </button>
    </div>
    {showKeyboard && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            background: colors.card,
            padding: "20px",
            borderRadius: "8px",
            boxShadow: `0 0 8px ${colors.glow}`,
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "30px",
              right: "40px",
              background: "transparent",
              border: "none",
              color: colors.textPrimary,
              fontSize: "24px",
              cursor: "pointer",
              backgroundColor: colors.buttonHint,
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 8px ${colors.glow}`,
            }}
            onClick={() => setShowKeyboard(false)}
          >
            &times;
          </button>
          <JapaneseKeyboard hints={[...(data?.readings_on ?? []), ...(data?.readings_kun ?? [])]} />
        </div>
      </div>
    )}
  </div>
);
}