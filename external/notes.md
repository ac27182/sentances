workflow.
---
google sheets raw data
-> grade 10
-> grade 9
-> grade 8
-> misc
-> bushu
---
extract and compile
-> grade_10.csv   -> grade_10_compiled.json
-> grade_09.csv   -> grade_09_compiled.json
-> grade_08.csv   -> grade_08_compiled.json
-> misc.csv       -> misc_compiled.json
-> bushu.csv      -> bushu_compiled.json
---
compile static site
-> menu
  -> grade_10
  -> grade_9
  -> grade_8
  -> misc
  -> bushu
---
common data model
- kanji: string
- hiragana: string
- translation: option[string]

- https://github.com/googleapis/google-api-nodejs-client
- https://developers.google.com/sheets/api/reference/rest
- https://docs.google.com/spreadsheets/d/e/2PACX-1vRKNensIlQ7fj0ntRfdmcAYBeDYXGRPAccd9nJogVtHYT54ciZ_073kTlSp4O9RUm-rRm_TNuNo4oS_/pubhtml


```
/compiled
index.html
index.css
```