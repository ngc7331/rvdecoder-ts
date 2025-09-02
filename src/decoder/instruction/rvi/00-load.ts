import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { rd, rs1, immI, funct3 } from './common'

export const loadFields: (DecodeField | ConditionalDecodeMode)[] = [
  rd,
  rs1,
  ...immI,
  funct3(['LB', 'LH', 'LW', 'LD', 'LBU', 'LHU', 'LWU', 'Reserved']),
]
