import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'

export const custom3Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 31, name: 'Custom' },
]
