import type { DecodeField, ConditionalDecodeMode } from '../../types'

export const reserved7Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 63, name: 'Reserved' },
]
