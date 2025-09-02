import { DecodeFieldType } from '@/types/decoder'
import type { DecodeField, ConditionalDecodeMode } from '@/types/decoder'

export const reserved7Fields: (DecodeField | ConditionalDecodeMode)[] = [
  { low: 7, high: 31, type: DecodeFieldType.RESERVED },
]
