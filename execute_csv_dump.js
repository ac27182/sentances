import tasks from "./tasks.json" assert { type: "json" }
import { csv_dump } from "./csv_dump.js"

tasks.forEach(csv_dump)