import React, { useState, useEffect } from "react";

const colors = {
    background: "#1E1E1E",
    card: "#252526",
    textPrimary: "#D4D4D4",
    hint: "#569CD6",
    answer: "#007ACC",
    answerText: "#DCDCAA",
    button: "#3A3D41",
    border: "#3A3D41",
    selected: "#264F78",
};

function Vocabulary() {
    const [pairs, setPairs] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [meaningList, setMeaningList] = useState([]);
    const [showMeaning, setShowMeaning] = useState(false);
    const [currentSet, setCurrentSet] = useState(() => {
        const savedSet = localStorage.getItem("currentSet");
        return savedSet ? parseInt(savedSet, 10) : 0;
    });
    const [selectedWord, setSelectedWord] = useState(null);
    const [selectedMeaning, setSelectedMeaning] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [pageInput, setPageInput] = useState(""); // State for user input

    useEffect(() => {
        localStorage.setItem("currentSet", currentSet.toString());
    }, [currentSet]);

    useEffect(() => {
        fetch("vocabData.json")
            .then((response) => response.json())
            .then((fetchedData) => {
                let formattedPairs = fetchedData
                    .slice(currentSet, currentSet + 8)
                    .map((item, index) => ({
                        id: `${item[0]}-${item[1]}-${index}`,
                        word: item[0],
                        furigana: item[1],
                        meaning: item[2].join(", "),
                    }));

                const shuffledPairs = formattedPairs.sort(() => Math.random() - 0.5);
                const words = [...shuffledPairs].sort(() => Math.random() - 0.5);
                const meanings = [...shuffledPairs].sort(() => Math.random() - 0.5);

                setPairs(shuffledPairs);
                setWordList(words);
                setMeaningList(meanings);
                setMatchedPairs([]);
                setSelectedWord(null);
                setSelectedMeaning(null);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [currentSet]);

    const nextSet = () => {
        setCurrentSet((prev) => prev + 8);
    };

    const prevSet = () => {
        setCurrentSet((prev) => (prev > 0 ? prev - 8 : 0));
    };

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value); // Update the input value
    };

    const goToPage = () => {
        const pageNumber = parseInt(pageInput, 10);
        if (!isNaN(pageNumber) && pageNumber >= 0) {
            setCurrentSet(pageNumber * 8); // Convert page number to set index
        } else {
            alert("Please enter a valid page number.");
        }
    };

    const copyToClipboard = (text, event) => {
        event.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        });
    };

    const handleWordClick = (wordObj) => {
        setSelectedWord(wordObj === selectedWord ? null : wordObj);
        checkMatch(wordObj, selectedMeaning);
    };

    const handleMeaningClick = (meaningObj) => {
        setSelectedMeaning(meaningObj === selectedMeaning ? null : meaningObj);
        checkMatch(selectedWord, meaningObj);
    };

    const checkMatch = (wordObj, meaningObj) => {
        if (wordObj && meaningObj) {
            // Find the meaning object that matches the word and includes the meaningObj
            const matchingMeaning = meaningList.find(
                (meaningObject) => meaningObject.word === wordObj.word && meaningObject === meaningObj
            );
    
            if (matchingMeaning) {
                setMatchedPairs((prev) => [...prev, wordObj]);
                setSelectedWord(null);
                setSelectedMeaning(null);
                
                console.log("Matched Meaning Object:", matchingMeaning); // Debugging log
            }
        }
    };
    

    return (
        <div style={{ backgroundColor: colors.background, minHeight: "100vh", padding: "20px", color: colors.textPrimary }}>
            <h1 style={{ textAlign: "center", color: colors.hint }}>Match the Pairs</h1>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <input
                    type="number"
                    placeholder="Enter page number"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.card,
                        color: colors.textPrimary,
                        marginRight: "10px",
                    }}
                />
                <button
                    onClick={goToPage}
                    style={{
                        backgroundColor: colors.button,
                        color: colors.textPrimary,
                        padding: "10px 20px",
                        border: `1px solid ${colors.border}`,
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Go to Page
                </button>
            </div>
            <button
                onClick={() => setShowMeaning(!showMeaning)}
                style={{
                    display: "block",
                    margin: "10px auto",
                    backgroundColor: colors.button,
                    color: colors.textPrimary,
                    padding: "10px 20px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {showMeaning ? "Hide Meanings" : "Show Meanings"}
            </button>
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", maxWidth: "600px", margin: "0 auto" }}>
                <div>
                    {wordList.map((wordObj) => (
                        <div
                            key={wordObj.id}
                            onClick={() => handleWordClick(wordObj)}
                            style={{
                                backgroundColor: matchedPairs.some((p) => p.id === wordObj.id)
                                    ? colors.answer
                                    : selectedWord?.id === wordObj.id
                                        ? colors.selected
                                        : colors.card,
                                padding: "15px",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                textAlign: "center",
                                border: `1px solid ${colors.border}`,
                                cursor: "pointer",
                            }}
                        >
                            {wordObj.word}
                        </div>
                    ))}
                </div>
                <div>
                    {meaningList.map((meaningObj) => (
                        <div
                            key={meaningObj.id}
                            onClick={() => handleMeaningClick(meaningObj)}
                            style={{
                                backgroundColor: matchedPairs.some((p) => p.id === meaningObj.id)
                                    ? colors.answer
                                    : selectedMeaning?.id === meaningObj.id
                                        ? colors.selected
                                        : colors.card,
                                padding: "15px",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                textAlign: "center",
                                border: `1px solid ${colors.border}`,
                                cursor: "pointer",
                            }}
                        >
                            {meaningObj.furigana}
                            {showMeaning && (
                                <>
                                    <p style={{ color: colors.answerText, marginTop: "5px" }}>{meaningObj.meaning}</p>
                                    <button
                                        onClick={(e) => copyToClipboard(meaningObj.meaning, e)}
                                        style={{
                                            marginTop: "5px",
                                            backgroundColor: colors.button,
                                            color: colors.textPrimary,
                                            padding: "5px 10px",
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Copy Answer
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={nextSet}
                style={{
                    display: "block",
                    margin: "20px auto",
                    backgroundColor: colors.button,
                    color: colors.textPrimary,
                    padding: "10px 20px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Next
            </button>

            <button
                onClick={prevSet}
                disabled={currentSet === 0}
                style={{
                    display: "block",
                    margin: "10px auto",
                    backgroundColor: colors.button,
                    color: colors.textPrimary,
                    padding: "10px 20px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "5px",
                    cursor: currentSet === 0 ? "not-allowed" : "pointer",
                    opacity: currentSet === 0 ? 0.5 : 1,
                }}
            >
                Back
            </button>
        </div>
    );
}

export default Vocabulary;