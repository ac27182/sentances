import { csv_dump } from "./csv_dump"
import { tasks } from "./tasks"

Promise.all(tasks.map(task => csv_dump(task).finally(() => console.log(`CSV_DUMP_TASK_COMPLETE:${task.name}`))))