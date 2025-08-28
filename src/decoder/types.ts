export enum DecodeFieldType {
  CSR_WPRI,
  CSR_RO0, // read-only 0
}

export interface DecodeField {
  width: number
  name?: string
  value?: string[] | Map<BigInt, string>
  type?: DecodeFieldType
}

export interface DecodeMode {
  name: string
  fields: DecodeField[]
}

export interface DecodeCategory {
  name: string
  items: DecodeMode[]
}
