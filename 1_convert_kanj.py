import json

# Define the kana to romaji mapping (including combined characters)
kana_data = {
    "hiragana": {
        # Basic Hiragana
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
        "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",

        # Combined Hiragana (Yōon)
        "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ",
        "sha": "しゃ", "shu": "しゅ", "sho": "しょ",
        "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ",
        "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ",
        "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ",
        "mya": "みゃ", "myu": "みゅ", "myo": "みょ",
        "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ",
        "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ",
        "ja": "じゃ", "ju": "じゅ", "jo": "じょ",
        "bya": "びゃ", "byu": "びゅ", "byo": "びょ",
        "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ"
    },
    "katakana": {
        # Basic Katakana
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
        "pa": "パ", "pi": "ピ", "pu": "プ", "pe": "ペ", "po": "ポ",

        # Combined Katakana (Yōon)
        "kya": "キャ", "kyu": "キュ", "kyo": "キョ",
        "sha": "シャ", "shu": "シュ", "sho": "ショ",
        "cha": "チャ", "chu": "チュ", "cho": "チョ",
        "nya": "ニャ", "nyu": "ニュ", "nyo": "ニョ",
        "hya": "ヒャ", "hyu": "ヒュ", "hyo": "ヒョ",
        "mya": "ミャ", "myu": "ミュ", "myo": "ミョ",
        "rya": "リャ", "ryu": "リュ", "ryo": "リョ",
        "gya": "ギャ", "gyu": "ギュ", "gyo": "ギョ",
        "ja": "ジャ", "ju": "ジュ", "jo": "ジョ",
        "bya": "ビャ", "byu": "ビュ", "byo": "ビョ",
        "pya": "ピャ", "pyu": "ピュ", "pyo": "ピョ"
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
    romaji_reading = []
    i = 0
    while i < len(reading):
        # Check for combined kana (e.g., "きゃ", "しゅ", "ちょ")
        if i + 1 < len(reading):
            combined_kana = reading[i] + reading[i + 1]
            if combined_kana in kana_to_romaji:
                romaji_reading.append(kana_to_romaji[combined_kana])
                i += 2
                continue
        # Check for small kana (e.g., "っ", "ゃ", "ゅ", "ょ")
        if reading[i] in kana_to_romaji:
            romaji_reading.append(kana_to_romaji[reading[i]])
        else:
            romaji_reading.append(reading[i])  # Leave unmapped characters as-is
        i += 1
    return "".join(romaji_reading)

# Load the kanji data from the JSON file
with open('kanji-wanikani.json', 'r', encoding='utf-8') as file:
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
with open('kanji_data_with_romaji_new_test.json', 'w', encoding='utf-8') as file:
    json.dump(kanji_data, file, ensure_ascii=False, indent=4)

print("Romaji pronunciations have been added and saved to 'kanji_data_with_romaji_new_test.json'.")
