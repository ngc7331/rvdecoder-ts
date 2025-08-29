export enum DecodeFieldType {
  INVALID,
  RESERVED,
  CSR_WPRI,
  CSR_RO0, // read-only 0
}

export const decodeFieldTypeDisplayName: Record<DecodeFieldType, string> = {
  [DecodeFieldType.INVALID]: 'INVALID',
  [DecodeFieldType.RESERVED]: 'RESERVED',
  [DecodeFieldType.CSR_WPRI]: 'WPRI',
  [DecodeFieldType.CSR_RO0]: 'RO0',
}

export const decodeFieldTypeDescription: Record<DecodeFieldType, string> = {
  [DecodeFieldType.INVALID]: 'Invalid, padding only',
  [DecodeFieldType.RESERVED]: 'Reserved',
  [DecodeFieldType.CSR_WPRI]: 'Write preserved, read ignored',
  [DecodeFieldType.CSR_RO0]: 'Read-only 0',
}

export interface DecodeField {
  low: number
  high?: number
  name?: string
  description?: string
  value?: string[] | Map<bigint, string>
  type?: DecodeFieldType
  extra?: (value: bigint) => string
}

export interface DecodeCondition {
  field: string
  value: bigint | bigint[]
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
