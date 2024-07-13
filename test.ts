import { createAutoEncoder } from './auto-encoder'
import { iris_dataset } from './res/iris'

let X = iris_dataset.data

const autoEncoder = createAutoEncoder({
  nInputs: X[0].length,
  nHidden: 3,
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

for (let i = 0; i < 50000; i++) {
  autoEncoder.fit(X, {
    // batchSize: 100,
    iterations: 10000,
    // method: 'adagrad',
    // stepSize: 0.01,
  })

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
  console.log(i + 1, mse)
}
