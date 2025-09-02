import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { rs1, rs2, immB, funct3 } from './common'

export const branchFields: (DecodeField | ConditionalDecodeMode)[] = [
  rs1,
  rs2,
  ...immB,
  funct3(['BEQ', 'BNE', 'BLT', 'BGE', 'BLTU', 'BGEU', 'Reserved', 'Reserved']),
]
