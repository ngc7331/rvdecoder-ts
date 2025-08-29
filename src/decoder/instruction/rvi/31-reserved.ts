import type { DecodeField, ConditionalDecodeMode } from '../../types'

export const reserved31Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 63, name: 'Reserved' },
]
