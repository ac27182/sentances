import { tasks } from "./tasks"
import { anki_compile } from "./anki_compile"

tasks.forEach((task) => anki_compile(task.name))
