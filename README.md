# auto-encoder.ts

A simple Auto Encoder typescript library for experimentation and dimensionality reduction. Supports automatic scaling.

[![npm Package Version](https://img.shields.io/npm/v/auto-encoder.ts)](https://www.npmjs.com/package/auto-encoder.ts)
[![Minified Package Size](https://img.shields.io/bundlephobia/min/auto-encoder.ts)](https://bundlephobia.com/package/auto-encoder.ts)
[![Minified and Gzipped Package Size](https://img.shields.io/bundlephobia/minzip/auto-encoder.ts)](https://bundlephobia.com/package/auto-encoder.ts)

This is a Typescript wrapper on top of [autoencoder](https://github.com/zemlyansky/autoencoder/blob/master/README.md).

![Auto Encoder Logo](https://github.com/zemlyansky/autoencoder/raw/master/assets/autoencoder.png)

## Features

- Automatic scaling (can be turned off)
- Typescript support
- Isomorphic package: works in Node.js and browsers
- Works with plain Javascript, Typescript is not mandatory

## Installation

```bash
npm install auto-encoder.ts
```

You can also install `auto-encoder.ts` with [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), or [slnpm](https://github.com/beenotung/slnpm)

## Usage Example

### Create new Auto Encoder

There are two ways to initialize a model:

- Provide the number of layers, input size, encoder output size (number of latent variables) and the activation function name

```typescript
import { createAutoEncoder } from 'auto-encoder.ts'

const model = createAutoEncoder({
  nInputs: 10,
  nHidden: 2,
  nLayers: 2, // (default 2) - number of layers in each encoder/decoder
  activation: 'relu', // (default 'relu') - applied to all, but the last layer
})
```

- Define each layer separately for both encoder and decoder

```typescript
import { createAutoEncoder } from 'auto-encoder.ts'

const model = createAutoEncoder({
  encoder: [
    { nOut: 10, activation: 'tanh' },
    { nOut: 2, activation: 'tanh' },
  ],
  decoder: [{ nOut: 2, activation: 'tanh' }, { nOut: 10 }],
  scale: false, // (default true)
})
```

**Activation functions**: `relu`, `tanh`, `sigmoid`

#### Auto Scaling

Similar to other neural networks, auto-encoder is very sensitive to input scaling.

To make it easier the scaling is enabled by default.

you can control it with an extra parameter `scale` that can be `true` or `false`.

### Train the Auto Encoder model

```typescript
model.fit(X, {
  batchSize: 100,
  iterations: 5000,
  method: 'adagrad', // (default 'adagrad')
  stepSize: 0.01, // (default 0.05)
})
```

**Optimization methods**: `sgd`, `adagrad`, `adam`

### Encode, Decode, Predict

```typescript
const Y = model.encode(X)
const Xd = model.decode(Y)

// Similar to model.decode(model.encode(X))
const Xp = model.predict(X)
```

### Web demo (dimensionality reduction)

Try the package in the browser on [StatSim Vis](https://statsim.com/vis). Choose a CSV file, change the _Projection method_ to **Autoencoder**, then click _Run_.

## Typescript Signature

Below are the exported function and types:

```typescript
function createAutoEncoder(options: AutoEncoderOptions): AutoEncoder

type AutoEncoder = {
  fit(X: BatchValues, options?: FitOptions): void
  encode(X: BatchValues): BatchValues
  decode(X: BatchValues): BatchValues
  predict(X: BatchValues): BatchValues
}

type FitOptions = {
  /** @default round(totalSize/50) */
  batchSize?: number
  /** @default 100 */
  iterations?: number
  /** @default adagrad */
  method?: OptimizationMethodName
  /** @default 0.05 */
  stepSize?: number
}

type BatchValues = Values[]

type Values = number[]

/** @default available methods in adnn/opt */
type OptimizationMethodName = 'sgd' | 'adagrad' | 'rmsprop' | 'adam'

type AutoEncoderOptions =
  | {
      /** @default true */
      scale?: boolean
      /** @description number of input features */
      nInputs: number
      /** @description number of embedding features */
      nHidden: number
      /**
       * @description number of layers in each encoder/decoder
       * @default 2
       */
      nLayers?: number
      /**
       * @description applied to all, but the last layer
       * @default 'relu'
       */
      activation?: ActivationFunctionName
    }
  | {
      /** @default true */
      scale?: boolean
      encoder: LayerOptions[]
      decoder: LayerOptions[]
    }

type ActivationFunctionName = 'relu' | 'tanh' | 'sigmoid'

type LayerOptions = {
  nOut: number
  activation?: ActivationFunctionName
}
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
