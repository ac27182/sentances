# tools

## problem specification

- classify each aozora bunk doucment by kanji kanken level, and assign a "rank" based on current ability

## modules

- kanji kanken lookup
  - get a "kanjis" kanken grade via lookup

- JIS shift to unicode
  - convert JIS charachters to unicode charachters (one file at a time)

- charachter checks
  - check a charachter is unicode kanji
  - check a charachter is unicode hiragana
  - check a charachter is unicode katakana

- build aozora bunka file dag
  - build a dag of all paths to "files" in aozora bunka repository
  - also preserve the "card" id for author lookup enrichment

- convert aozora bunka file from JIS charset to unicode charset

# tools

## problem specification

- kanken "dictionary" into a big list (not vertical)

## modules

- csv kanken row -> (word, reading, translation)
- join grades together in a map (word -> (reading, translation))
- view 
  - grade (taggable)
    - kanji (taggable)
    - word, reading, (translation, toggleable), dictionary entry, kanji, photo lookup
    - (highlight on hover)
    - (grade has count)
    - (kanji has count)

# todo

> look into `JMDICT` to get raw data on readings of kanji (find the kanji with only one reading)

- https://www.reddit.com/r/LearnJapanese/comments/1456qj6/is_there_any_japanese_dictionary_api_available/