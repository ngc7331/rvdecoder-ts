import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { frd, rs1, immI, funct3 } from './common'

export const loadFpFields: (DecodeField | ConditionalDecodeMode)[] = [
  frd,
  rs1,
  ...immI,
  funct3(['Reserved', 'FLH', 'FLW', 'FLD', 'FLQ', 'Reserved', 'Reserved', 'Reserved']),
]
