import React, { useState, useEffect } from "react";

const HIRAGANA = [
    { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
    { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
    { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
    { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
    { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
    { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
    { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
    { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
    { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
    { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" },
    { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" }, { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" },
    { char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" },
    { char: "だ", romaji: "da" }, { char: "ぢ", romaji: "ji" }, { char: "づ", romaji: "zu" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" },
    { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" },
    { char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" },
    { char: "ゃ", romaji: "ya" }, { char: "ゅ", romaji: "yu" }, { char: "ょ", romaji: "yo" },
    { char: "っ", romaji: "tsu" }, { char: "-", romaji: "-" }, { char: ".", romaji: "." },
];

const KATAKANA = HIRAGANA.map(c => {
    if (c.char === '-' || c.char === '.') {
        return c;
    }
    return { char: String.fromCharCode(c.char.charCodeAt(0) + 96), romaji: c.romaji };
});

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

const JapaneseKeyboard = ({ hints = [] }) => {
    const [text, setText] = useState("");
    const [furiganaText, setFuriganaText] = useState("");
    const [isHiragana, setIsHiragana] = useState(true);
    const [buttonSize, setButtonSize] = useState(parseInt(localStorage.getItem("buttonSize")) || 40); // Default button size
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem("fontSize")) || 14);
    const [toggleHints, setToggleHints] = useState(JSON.parse(localStorage.getItem("toggleHints")) || false);

    useEffect(() => {
        localStorage.setItem("toggleHints", JSON.stringify(toggleHints));
    }, [toggleHints]);
    // Save buttonSize and fontSize to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("buttonSize", buttonSize.toString());
        localStorage.setItem("fontSize", fontSize.toString());
    }, [buttonSize, fontSize]);

    const handlePress = (char) => {
        const newText = text + char;
        setText(newText);
    };
    const handleFuriganaPress = (char) => {
        const newFuriganaText = furiganaText + char;
        setFuriganaText(newFuriganaText);
    }

    const handleBackspace = () => {
        setText(text.slice(0, -1));
    };

    const handleSubmit = () => {
        if (text.includes(hints[currentHintIndex])) {
            setCurrentHintIndex((prevIndex) => (prevIndex + 1) % hints.length);
            setText("");
        } else {
            // Do nothing for now
        }
    };

    const increaseButtonSize = () => {
        setButtonSize(prevSize => prevSize + 5);
        setFontSize(prevSize => prevSize + 1.2);
    };

    const decreaseButtonSize = () => {
        setButtonSize(prevSize => prevSize - 5);
        setFontSize(prevSize => prevSize - 1.2);
    };

    const toggleHint = () => {
        setToggleHints(!toggleHints);
    }
    return (
        <div style={{ padding: "20px", maxWidth: "96%", margin: "0 auto", backgroundColor: colors.background, borderRadius: "10px", boxShadow: `0 4px 10px ${colors.glow}`, overflowY: "auto", maxHeight: "80vh" }}>
            {/* Display the current hint */}
            {toggleHints ? 
            <div onClick={toggleHint} style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", color: colors.textPrimary }}>
                Current Hint: {hints[currentHintIndex]}
            </div>            
            : <div onClick={toggleHint} style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", color: colors.textPrimary }}>
            Reveal Hint
        </div>   }

            {/* Input field */}
            <input 
                type="text" 
                style={{ 
                    width: "100%", 
                    height: "40px", 
                    border: `1px solid ${colors.border}`, 
                    borderRadius: "5px", 
                    marginBottom: "20px", 
                    textAlign: "center", 
                    fontSize: "18px", 
                    padding: "0 10px", 
                    outline: "none", 
                    color: colors.textPrimary, 
                    backgroundColor: colors.card 
                }} 
                value={text} 
                onChange={(e) => setText(e.target.value)}
            />

            {/* <input 
                type="text" 
                style={{ 
                    width: "100%", 
                    height: "40px", 
                    border: `1px solid ${colors.border}`, 
                    borderRadius: "5px", 
                    marginBottom: "20px", 
                    textAlign: "center", 
                    fontSize: "18px", 
                    padding: "0 10px", 
                    outline: "none", 
                    color: colors.textPrimary, 
                    backgroundColor: colors.card 
                }} 
                value={furiganaText} 
                onChange={(e) => setText(e.target.value)}
            /> */}


            {/* Keyboard buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                {(isHiragana ? HIRAGANA : KATAKANA).map((item, index) => (
                    <button 
                        key={index} 
                        style={{ 
                            width: `${buttonSize}px`, 
                            height: `${buttonSize + 10}px`, 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            border: `1px solid ${colors.border}`, 
                            borderRadius: "8px", 
                            backgroundColor: colors.card, 
                            cursor: "pointer", 
                            fontSize: `${(fontSize + 2.4 )}px`, 
                            transition: "all 0.2s ease",
                            boxShadow: `0 2px 5px ${colors.glow}`,
                            color: colors.textPrimary,
                        }} 
                        onClick={() => {
                            handlePress(item.char)
                            handleFuriganaPress(item.romaji)
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = colors.hint}
                        onMouseOut={(e) => e.target.style.backgroundColor = colors.card}
                    >
                        <div>{item.char}</div>
                        <small style={{ color: colors.textSecondary }}>{item.romaji}</small>
                    </button>
                ))}
            </div>

            {/* Control buttons */}
            <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
                <button 
                    style={{ 
                        padding: "12px 25px", 
                        backgroundColor: colors.buttonHint, 
                        borderRadius: "30px", 
                        color: colors.textPrimary, 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        transition: "background-color 0.2s ease", 
                        border: "none" 
                    }} 
                    onClick={() => setIsHiragana(!isHiragana)}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.hint}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.buttonHint}
                >
                    {isHiragana ? "Switch to Katakana" : "Switch to Hiragana"}
                </button>
                
                <button 
                    style={{ 
                        padding: "12px 25px", 
                        backgroundColor: colors.buttonAnswer, 
                        borderRadius: "30px", 
                        color: colors.textPrimary, 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        transition: "background-color 0.2s ease", 
                        border: "none" 
                    }} 
                    onClick={handleBackspace}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.hint}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.buttonAnswer}
                >
                    Backspace
                </button>

                <button 
                    style={{ 
                        padding: "12px 25px", 
                        backgroundColor: colors.buttonNext, 
                        borderRadius: "30px", 
                        color: colors.textPrimary, 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        transition: "background-color 0.2s ease", 
                        border: "none" 
                    }} 
                    onClick={handleSubmit}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.hint}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.buttonNext}
                >
                    Submit
                </button>
            </div>

            {/* Button size controls */}
            <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
                <button 
                    style={{ 
                        padding: "12px 25px", 
                        backgroundColor: colors.buttonNext, 
                        borderRadius: "30px", 
                        color: colors.textPrimary, 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        transition: "background-color 0.2s ease", 
                        border: "none" 
                    }} 
                    onClick={increaseButtonSize}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.hint}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.buttonNext}
                >
                   +
                </button>

                <button 
                    style={{ 
                        padding: "12px 25px", 
                        backgroundColor: colors.buttonPrev, 
                        borderRadius: "30px", 
                        color: colors.textPrimary, 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        transition: "background-color 0.2s ease", 
                        border: "none" 
                    }} 
                    onClick={decreaseButtonSize}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.hint}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.buttonPrev}
                >
                    -
                </button>
            </div>
        </div>
    );
};

export default JapaneseKeyboard;