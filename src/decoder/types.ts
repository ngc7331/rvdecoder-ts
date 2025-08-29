export enum DecodeFieldType {
  CSR_WPRI,
  CSR_RO0, // read-only 0
}

export interface DecodeField {
  low: number
  high?: number
  name?: string
  value?: string[] | Map<BigInt, string>
  type?: DecodeFieldType
}

export interface DecodeCondition {
  field: string
  value: BigInt
}

export interface ConditionalDecodeMode {
  name: string
  fields: (DecodeField | ConditionalDecodeMode)[]
  condition: DecodeCondition
}

export interface DecodeMode {
  name: string
  fields: (DecodeField | ConditionalDecodeMode)[]
  condition?: DecodeCondition
}

export interface DecodeCategory {
  name: string
  items: DecodeMode[]
}
