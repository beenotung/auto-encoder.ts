import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  AutoEncoder,
  createAutoEncoder,
  exportAutoEncoder,
  restoreAutoEncoder,
} from './auto-encoder'
import { iris_dataset } from './res/iris'

let X = iris_dataset.data

let file = 'net.json'

function loadAutoEncoder(): AutoEncoder {
  if (existsSync(file)) {
    return restoreAutoEncoder(JSON.parse(readFileSync(file).toString()))
  }
  return createAutoEncoder({
    nInputs: X[0].length,
    nHidden: 3,
    nLayers: 1,
    activation: 'tanh',
    // encoder: [
    //   { nOut: X[0].length, activation: 'tanh' },
    //   { nOut: 3, activation: 'tanh' },
    // ],
    // decoder: [
    //   { nOut: 3, activation: 'tanh' },
    //   {
    //     nOut: X[0].length,
    //   },
    // ],
  })
}

let autoEncoder = loadAutoEncoder()

function test() {
  let Y = autoEncoder.predict(X)

  let mse = 0
  for (let i = 0; i < Y.length; i++) {
    let x = X[i]
    let y = Y[i]
    for (let j = 0; j < x.length; j++) {
      let e = x[j] - y[j]
      mse += e * e
    }
  }
  mse /= Y.length

  return mse
}

console.log('before:')
console.log(test())

autoEncoder.fit(X, {
  // batchSize: 100,
  iterations: 10000,
  // method: 'adagrad',
  // stepSize: 0.01,
})

console.log('after:')
console.log(test())

writeFileSync(file, JSON.stringify(exportAutoEncoder(autoEncoder), null, 2))
