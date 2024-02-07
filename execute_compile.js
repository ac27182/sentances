import tasks from "./tasks.json" assert { type: "json" }
import { anki_compile } from "./anki_compile.js"
import { json_compile } from "./json_compile.js"
import { html_compile } from "./html_compile.js"

tasks
  .forEach((task) => {
    anki_compile(task.name)
    json_compile(task.name)
    html_compile(task.name)
  })
