import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'

export const opImmFields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 31, name: 'TODO' },
  { low: 32, high: 63, type: DecodeFieldType.INVALID },
]
