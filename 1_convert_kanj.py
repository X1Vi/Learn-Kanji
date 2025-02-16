import json
import pykakasi

# Initialize pykakasi
kks = pykakasi.kakasi()

# Function to convert Japanese readings to romaji using pykakasi
def japanese_to_romaji(reading):
    result = kks.convert(reading)
    romaji_reading = "".join([item['hepburn'] for item in result])
    return romaji_reading

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

