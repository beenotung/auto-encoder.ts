const AutoEncoder = require('autoencoder')

export type AutoEncoder = {
  fit(X: BatchValues, options?: FitOptions): void
  encode(X: BatchValues): BatchValues
  decode(X: BatchValues): BatchValues
  predict(X: BatchValues): BatchValues
}

export type FitOptions = {
  /** @default round(totalSize/50) */
  batchSize?: number

  /** @default 100 */
  iterations?: number

  /** @default adagrad */
  method?: OptimizationMethodName

  /** @default 0.05 */
  stepSize?: number
}

export type BatchValues = Values[]

export type Values = number[]

/** @default available methods in adnn/opt */
export type OptimizationMethodName = 'sgd' | 'adagrad' | 'rmsprop' | 'adam'

export type AutoEncoderOptions =
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

export type ActivationFunctionName = 'relu' | 'tanh' | 'sigmoid'

export type LayerOptions = {
  nOut: number
  activation: ActivationFunctionName
}

export function createAutoEncoder(options: AutoEncoderOptions): AutoEncoder {
  return new AutoEncoder(options)
}
