import type { DecodeField, ConditionalDecodeMode } from '@/types/decoder'

import { rs1, rs2, immS, funct3 } from './common'

export const storeFields: (DecodeField | ConditionalDecodeMode)[] = [
  rs1,
  rs2,
  ...immS,
  funct3(['SB', 'SH', 'SW', 'SD', 'Reserved', 'Reserved', 'Reserved', 'Reserved']),
]
