import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rs1, frs2, immS, funct3 } from './common'

export const storeFpFields: (DecodeField | ConditionalDecodeMode)[] = [
  rs1,
  frs2,
  ...immS,
  funct3(['Reserved', 'FSH', 'FSW', 'FSD', 'FSQ', 'Reserved', 'Reserved', 'Reserved']),
]
