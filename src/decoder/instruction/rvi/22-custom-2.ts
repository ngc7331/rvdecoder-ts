import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'

export const custom2Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 31, name: 'Custom' },
  { low: 32, high: 63, type: DecodeFieldType.INVALID },
]
