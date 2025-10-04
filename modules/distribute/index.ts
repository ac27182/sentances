import { readdirSync, readFileSync, writeFileSync } from "node:fs"

const data = readFileSync("./modules/distribute/proportion-of-records-by-account.csv", 'utf-8')

type Row = {
  account: string
  record_count: number
}

type task_type = "multi_tenant" | "single_tenant"
type Enriched = {
  account: string
  record_count: number
  traffic_percentage: number
  task_count: number
  task_type: task_type
}

const parsed = 
  data
    .split("\n")
    .map(row => {
      const [account, record_count] = row.split(",")
      return {account, record_count: Math.round(Number(record_count))}
    })

const total_records = parsed.reduce((acc, row) => row.record_count+ acc ,0)

const parallelism = 128

const enriched: Array<Enriched> = parsed.map(row => {

  const traffic_percentage_decimal = Number(((row.record_count / total_records)))

  const traffic_percentage = Number((traffic_percentage_decimal * 100).toFixed(4))

  const task_type: task_type = traffic_percentage < 0.5 ? "multi_tenant" : "single_tenant"

  console.log(traffic_percentage_decimal)

  let task_count = (task_type === "multi_tenant") ? 2 : Math.floor(traffic_percentage_decimal * parallelism)

  if (task_count === 0) {
    task_count = 1
  }

  return {
    ...row,
    traffic_percentage,
    task_type,
    task_count
  }
})

console.log(parsed.length)

console.table(enriched.filter(row => row.record_count < 20000))

const object: {[key: string]: number} = {}

const hook = (enriched: Enriched): void => {
  if (enriched.task_type === 'single_tenant') {
    object[enriched.account] = enriched.task_count
  }
} 

enriched.forEach(hook)

console.log(JSON.stringify(object, null, 2))



// In light of the recent issues we have been having with scaling the ingest aggregator I decided to write a small tool to break down the ingest traffic and map that to a programatic "split factor" which I hope we could refine and apply in production some time next quarter (or soon). When I get time I will put this forward in a more formal document but wanted to share.

// *points*
// - the top `16` (top 16.7%) of ingest users make up for 99.5% of the ingest traffic
// - The top 16 could have their split factor applied _programatically_ based on a sliding window of the past 1 week of ingest traffic 
// - we could likely handle 83% of the ingest aggregtor users with just 2 - 4 parallel flink tasks (based on message volume)

// *example*
// * given a flink applciation with 32 parallel tasks
// * given a snapshot of the last 7 days of ingest traffic 
// * we can apply the traffic percentage to the flink task count (for all accounts above 0.5% traffic) to arrive at a programatic split factor. 
// * _see the screenshot below for split factor (task count)_
// * for the remaining 0.5% of ingest traffic, we could try and find a way to "force" these accounts to share a smaller pool of s3 sink tasks for writing to distribute the load more sensibly

// *some caveates*
// * the above calculations were done with records in to kinesis. I think it would be more sensible to balance this with the size of the messages as well
// * again, the account list was pulled from the kinesis messages, but many of those accounts might not be writing data to plazma, so there could be even less
// * we would need to handle the case where we have a new high volume account is coming in unexpectedly





