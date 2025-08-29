import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'

export const reserved26Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 63, name: 'Reserved' },
]
