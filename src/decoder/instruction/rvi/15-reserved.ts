import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'

export const reserved15Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 31, type: DecodeFieldType.RESERVED },
]
