import json

# Define the kana to romaji mapping
kana_data = {
    "hiragana": {
        "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
        "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
        "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
        "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
        "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
        "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
        "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
        "ya": "や", "yu": "ゆ", "yo": "よ",
        "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
        "wa": "わ", "wo": "を", "n": "ん",
        
        # Dakuon (voiced)
        "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
        "za": "ざ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
        "da": "だ", "ji": "ぢ", "zu": "づ", "de": "で", "do": "ど",
        "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
        
        # Handakuon (semi-voiced)
        "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ"
    },
    "katakana": {
        "a": "ア", "i": "イ", "u": "ウ", "e": "エ", "o": "オ",
        "ka": "カ", "ki": "キ", "ku": "ク", "ke": "ケ", "ko": "コ",
        "sa": "サ", "shi": "シ", "su": "ス", "se": "セ", "so": "ソ",
        "ta": "タ", "chi": "チ", "tsu": "ツ", "te": "テ", "to": "ト",
        "na": "ナ", "ni": "ニ", "nu": "ヌ", "ne": "ネ", "no": "ノ",
        "ha": "ハ", "hi": "ヒ", "fu": "フ", "he": "ヘ", "ho": "ホ",
        "ma": "マ", "mi": "ミ", "mu": "ム", "me": "メ", "mo": "モ",
        "ya": "ヤ", "yu": "ユ", "yo": "ヨ",
        "ra": "ラ", "ri": "リ", "ru": "ル", "re": "レ", "ro": "ロ",
        "wa": "ワ", "wo": "ヲ", "n": "ン",
        
        # Dakuon (voiced)
        "ga": "ガ", "gi": "ギ", "gu": "グ", "ge": "ゲ", "go": "ゴ",
        "za": "ザ", "ji": "ジ", "zu": "ズ", "ze": "ゼ", "zo": "ゾ",
        "da": "ダ", "ji": "ヂ", "zu": "ヅ", "de": "デ", "do": "ド",
        "ba": "バ", "bi": "ビ", "bu": "ブ", "be": "ベ", "bo": "ボ",
        
        # Handakuon (semi-voiced)
        "pa": "パ", "pi": "ピ", "pu": "プ", "pe": "ペ", "po": "ポ"
    }
}
# Create a reverse mapping from kana to romaji
kana_to_romaji = {}
for romaji, kana in kana_data["hiragana"].items():
    kana_to_romaji[kana] = romaji
for romaji, kana in kana_data["katakana"].items():
    kana_to_romaji[kana] = romaji

# Function to convert Japanese readings to romaji
def japanese_to_romaji(reading):
    romaji = []
    i = 0
    while i < len(reading):
        # Check for special cases like small "tsu" (っ) or small "ya/yu/yo" (ゃ/ゅ/ょ)
        if i + 1 < len(reading) and reading[i] == "っ":
            romaji.append("")  # Small "tsu" doubles the next consonant
            i += 1
        elif i + 1 < len(reading) and reading[i + 1] in {"ゃ", "ゅ", "ょ"}:
            # Handle combined kana like "きゃ" (kya)
            combined_kana = reading[i] + reading[i + 1]
            romaji.append(kana_to_romaji.get(combined_kana, combined_kana))
            i += 2
        else:
            # Handle single kana
            romaji.append(kana_to_romaji.get(reading[i], reading[i]))
            i += 1
    return "".join(romaji)

# Load the existing kanji data
with open('kanji-practice/kanji-wanikani.json', 'r', encoding='utf-8') as file:
    kanji_data = json.load(file)

# Add romaji pronunciations to the readings
for kanji, data in kanji_data.items():
    # Add romaji for 'readings_on'
    data['readings_on_romaji'] = [japanese_to_romaji(reading) for reading in data['readings_on']]
    
    # Add romaji for 'readings_kun'
    data['readings_kun_romaji'] = [japanese_to_romaji(reading) for reading in data['readings_kun']]
    
    # Add romaji for 'wk_readings_on'
    data['wk_readings_on_romaji'] = [japanese_to_romaji(reading) for reading in data['wk_readings_on']]
    
    # Add romaji for 'wk_readings_kun'
    data['wk_readings_kun_romaji'] = [japanese_to_romaji(reading) for reading in data['wk_readings_kun']]

# Save the updated data to a new file
with open('kanji_data_with_romaji.json', 'w', encoding='utf-8') as file:
    json.dump(kanji_data, file, ensure_ascii=False, indent=4)

print("Romaji pronunciations have been added and saved to 'kanji_data_with_romaji.json'.")
