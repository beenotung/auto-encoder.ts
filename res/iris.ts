import { readFileSync } from 'fs'
import { from_csv } from '@beenotung/tslib/csv'

let rows = from_csv(readFileSync('res/iris.csv').toString())

let [headers] = rows.splice(0, 1)

let data = rows.map(row => [+row[0], +row[1], +row[2], +row[3]])

export let iris_dataset = {
  headers,
  data,
}
