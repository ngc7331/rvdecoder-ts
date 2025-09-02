import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { rd, rs1, immI, funct3 } from './common'

export const jalrFields: (DecodeField | ConditionalDecodeMode)[] = [
  rs1,
  rd,
  ...immI,
  funct3(new Map([[BigInt(0), 'JALR']])),
]
