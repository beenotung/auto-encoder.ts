import { createAutoEncoder } from './auto-encoder'
import { iris_dataset } from './res/iris'

let X = iris_dataset.data

const autoEncoder = createAutoEncoder({
  nInputs: X[0].length,
  nHidden: 10,
})

for (let i = 0; i < 50000; i++) {
  autoEncoder.fit(X, {
    iterations: 10000,
    stepSize: 0.01,
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
