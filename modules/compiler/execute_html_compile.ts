import { tasks } from "./tasks"
import { html_compile } from "./html_compile"

html_compile(tasks.map(task => task.name))
