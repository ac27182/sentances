import tasks from "./tasks.json" assert { type: "json" }
import { csv_dump } from "./csv_dump.js"

tasks.forEach(task => csv_dump(task.name,task.sheed_id))