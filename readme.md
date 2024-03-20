# documentation

## google sheets api

- [nodejs client](https://github.com/googleapis/google-api-nodejs-client)
- [rest api client](https://developers.google.com/sheets/api/reference/rest)

# Kanji kentei learning materials

- [todai japanese news reader](https://easyjapanese.net/)
- [kanji kentei wikipedia](https://en.wikipedia.org/wiki/Kanji_Kentei)
- [kanji kentei advice](https://roshiajin.jp/kankenlevel1/)
- [basic words for speach](https://en.wiktionary.org/wiki/Appendix:1000_Japanese_basic_words)

# Backlinks

- [kanji database](https://www.kanjidatabase.com/sql.php)
- [tsukuba corpus](https://tsukubawebcorpus.jp/search/)
- [JIS to unicode](https://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0208.TXT)
- [unicode - kanji](https://www.unicode.org/charts/PDF/U4E00.pdf)
- [unicode - hiragana](https://www.unicode.org/charts/PDF/U3040.pdf)
- [unicode - katakana](https://www.unicode.org/charts/PDF/U30A0.pdf)

# Questions

- how many kanji have exclusively 1 `official` onyomi reading?
  - 743

- how many kanji have exclusively 1 `official` kunyomi reading?
  - 65

- how many kanji have exactly 1 `official` kunyomi and onyomi reading?
  - 687

- how many kanji have 1 `official` onyomi reading (excluding kun)?
  - 1786

- how many joyo kanji are there?
  - 2136

- how many kyoiku kanji are there?
  - 1026

# kanji database queries
```sql
select 
  `Kanji`,
  `Reading within Joyo`,
  `# of On`,
  `# of Kun within Joyo with inflections`,
  `# of Kun within Joyo without inflections`
from 
  `KanjiTable`
where 
  `# of On` <= 1 and `# of Kun within Joyo with inflections` <= 1
order by 
  `Kanji`
```