import { tasks } from "./tasks"
import { anki_compile } from "./anki_compile"
import { json_compile } from "./json_compile"
import { html_compile } from "./html_compile"

tasks
  .forEach((task) => {
    anki_compile(task.name)
    json_compile(task.name)
    html_compile(task.name)
  })
