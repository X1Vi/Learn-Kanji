import { useState, useEffect } from "react";

export default function KanjiFlashcard() {
  const [kanjiData, setKanjiData] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(localStorage.getItem("lastIndex")) || 0);
  const [range, setRange] = useState(() => JSON.parse(localStorage.getItem("range")) || [0, 50]);
  const [searchQuery, setSearchQuery] = useState("");
  const [_meaning, setMeaning] = useState("");

  useEffect(() => {
    fetch("kanji_data_with_romaji.json")
      .then((response) => response.json())
      .then((data) => setKanjiData(Object.entries(data)))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("lastIndex", currentIndex);
    localStorage.setItem("range", JSON.stringify(range));
  }, [currentIndex, range]);

  if (!kanjiData) {
    return <p style={{ fontSize: "24px", textAlign: "center", marginTop: "20px", color: "#fff" }}>Loading...</p>;
  }

  const filteredKanji = kanjiData.filter(([kanji, data]) =>
    kanji.includes(searchQuery) ||
    data.meanings.some(meaning => meaning.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [kanji, data] = filteredKanji[currentIndex] || ["", {}];

  const checkMeaning = () => {
    return data.meanings.some(meaning => _meaning.toLowerCase() === meaning.toLowerCase());
  };

  const nextKanji = () => {
    setShowAnswer(false);
    setShowHint(false);
    setCurrentIndex((prevIndex) => {
      const [start, end] = range;
      return prevIndex + 1 >= filteredKanji.length ? start : prevIndex + 1;
    });
  };

  const prevKanji = () => {
    if(kanjiData[currentIndex] === kanjiData[0]){
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

  const handleKeyPress = (e) => {
    if (e.code === "ShiftLeft") { 
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
    background: "#121212",
    card: "#1e1e1e",
    textPrimary: "#ffffff",
    textSecondary: "#bbbbbb",
    hint: "#00aaff",
    answer: "#00ff88",
    buttonHint: "#005f99",
    buttonAnswer: "#007a55",
    buttonNext: "#993300",
    buttonPrev: "#552200"
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: colors.background,
      color: colors.textPrimary,
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <input
        type="text"
        placeholder="Search by kanji or meaning"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
          fontSize: "clamp(14px, 4vw, 16px)",
          width: "100%",
          maxWidth: "400px",
          outline: "none"
        }}
      />
      <input
        type="text"
        placeholder="Enter range (e.g. 0-50)"
        onBlur={handleRangeChange}
        style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
          fontSize: "clamp(14px, 4vw, 16px)",
          width: "100%",
          maxWidth: "400px",
          outline: "none"
        }}
      />
      <p style={{ fontSize: "clamp(16px, 4vw, 18px)", color: colors.textSecondary, marginBottom: "8px", zIndex: 2 }}>Current: {currentIndex + 1} / {filteredKanji.length}</p>
      <div style={{
        padding: "clamp(16px, 5vw, 32px)",
        width: "100%",
        maxWidth: "600px",
        textAlign: "center",
        border: "2px solid #444",
        borderRadius: "16px",
        background: colors.card,
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s ease-in-out",
        transform: showAnswer ? "scale(1.05)" : "scale(1)"
      }}>
        <h1 style={{ fontSize: "clamp(48px, 10vw, 64px)", fontWeight: "bold", marginBottom: "20px", color: colors.textPrimary, transition: "0.3s" }}>{kanji}</h1>
        <p style={{ color: colors.textSecondary, fontSize: "clamp(16px, 4vw, 22px)" }}>{data.strokes} stroke(s)</p>
        <p style={{ color: colors.textSecondary, fontSize: "clamp(14px, 4vw, 20px)" }}>
          On'yomi (Chinese reading): {data.readings_on?.join(", ")} ({data.readings_on_romaji?.join(", ")})
        </p>
        <p style={{ color: colors.textSecondary, fontSize: "clamp(14px, 4vw, 20px)" }}>
          Kun'yomi (Japanese reading): {data.readings_kun?.join(", ")} ({data.readings_kun_romaji?.join(", ")})
        </p>
        {showHint && <p style={{ color: colors.hint, fontSize: "clamp(14px, 4vw, 20px)", fontStyle: "italic" }}>Hint: {data.wk_radicals?.join(", ")}</p>}
        {showAnswer ? (
          <p style={{ color: colors.answer, fontSize: "clamp(18px, 5vw, 24px)", fontWeight: "bold" }}>Meaning: {data.meanings?.join(", ")}</p>
        ) : (
          <p style={{ color: colors.textSecondary, fontSize: "clamp(14px, 4vw, 20px)" }}>Do you know the meaning?</p>
        )}
        <input
          placeholder="Enter Meaning"
          onChange={(value) => {
            setMeaning(value.target.value);
          }}
          onKeyDown={handleKeyPress}
          style={{
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
            fontSize: "clamp(14px, 4vw, 16px)",
            width: "80%",
            maxWidth: "400px",
            outline: "none"
          }}
        />
        <button
          style={{
            padding: "14px 24px",
            background: colors.buttonHint,
            color: "white",
            borderRadius: "8px",
            marginBottom: "16px",
            transition: "background 0.3s",
            width: "100%",
            maxWidth: "400px",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={() => {
            const isCorrect = checkMeaning();
            const toast = document.createElement("div");
            toast.textContent = isCorrect ? "Correct" : "Incorrect";
            toast.style.position = "fixed";
            toast.style.bottom = "20px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.background = isCorrect ? colors.answer : "#ff4444";
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
          }}
        >
          Check Meaning
        </button>
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "14px 24px",
              background: colors.buttonHint,
              color: "white",
              borderRadius: "8px",
              transition: "background 0.3s",
              fontSize: "clamp(14px, 4vw, 16px)",
              fontWeight: "bold",
              cursor: "pointer",
              flex: "1 1 45%"
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
              transition: "background 0.3s",
              fontSize: "clamp(14px, 4vw, 16px)",
              fontWeight: "bold",
              cursor: "pointer",
              flex: "1 1 45%"
            }}
            onClick={() => setShowAnswer(true)}
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
              transition: "background 0.3s",
              fontSize: "clamp(14px, 4vw, 16px)",
              fontWeight: "bold",
              cursor: "pointer",
              flex: "1 1 45%"
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
              transition: "background 0.3s",
              fontSize: "clamp(14px, 4vw, 16px)",
              fontWeight: "bold",
              cursor: "pointer",
              flex: "1 1 45%"
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}