import {
  ActivationFunctionName,
  Network,
  OptimizationMethodName,
  nn,
} from 'adnn.ts'

const AutoEncoder = require('autoencoder')

export interface AutoEncoder {
  /** @default true */
  scale?: boolean

  max: number[]
  min: number[]

  nInputs: number
  nHidden: number

  /** @description mlp */
  encoder: Network

  /** @description mlp */
  decoder: Network

  /** @description sequence([encoder,decoder]) */
  net: Network

  fit(X: BatchValues, options?: FitOptions): void

  encode(X: BatchValues): BatchValues

  decode(X: BatchValues): BatchValues

  /** @description Similar to this.decode(this.encode(X)) */
  predict(X: BatchValues): BatchValues
}

export type FitOptions = {
  /** @default round(totalSize/50) */
  batchSize?: number

  /** @default 100 */
  iterations?: number

  /** @default 'adagrad' */
  method?: OptimizationMethodName

  /** @default 0.05 */
  stepSize?: number
}

export type BatchValues = Values[]

export type Values = number[]

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

export type LayerOptions = {
  nOut: number
  /** @description no activation function in the last layer of decoder gives better result */
  activation?: ActivationFunctionName
}

export function createAutoEncoder(options: AutoEncoderOptions): AutoEncoder {
  let autoEncoder: AutoEncoder = new AutoEncoder(options)
  autoEncoder.scale = options.scale
  autoEncoder.encoder.serializeJSON()

  return autoEncoder
}

export type AutoEncoderJSON = ReturnType<typeof exportAutoEncoder>

export function exportAutoEncoder(autoEncoder: AutoEncoder) {
  return {
    scale: autoEncoder.scale,
    max: autoEncoder.max,
    min: autoEncoder.min,
    nInputs: autoEncoder.nInputs,
    nHidden: autoEncoder.nHidden,
    encoder: autoEncoder.encoder.serializeJSON(),
    decoder: autoEncoder.decoder.serializeJSON(),
  }
}

export function restoreAutoEncoder(json: AutoEncoderJSON): AutoEncoder {
  let autoEncoder = createAutoEncoder({
    scale: json.scale,
    nInputs: 1,
    nHidden: 1,
    nLayers: 1,
  })
  autoEncoder.max = json.max
  autoEncoder.min = json.min
  autoEncoder.nInputs = json.nInputs
  autoEncoder.nHidden = json.nHidden
  autoEncoder.encoder = Network.deserializeJSON(json.encoder)
  autoEncoder.decoder = Network.deserializeJSON(json.decoder)
  autoEncoder.net = nn.sequence([autoEncoder.encoder, autoEncoder.decoder])
  return autoEncoder
}
