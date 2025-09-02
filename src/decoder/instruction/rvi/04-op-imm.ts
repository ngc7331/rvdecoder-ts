import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { rd, rs1, funct3, immI, shamt6, funct6 } from './common'

export const opImmFields: (DecodeField | ConditionalDecodeMode)[] = [
  rd,
  rs1,
  funct3(['ADDI', 'SLLI', 'SLTI', 'SLTIU', 'XORI', 'SRLI/SRAI', 'ORI', 'ANDI']),
  {
    name: 'other',
    condition: {
      field: 'funct3',
      value: [BigInt(0), BigInt(2), BigInt(3), BigInt(4), BigInt(6), BigInt(7)],
    },
    fields: immI,
  },
  {
    name: 'SLLI',
    condition: {
      field: 'funct3',
      value: BigInt(1),
    },
    fields: [shamt6, funct6(new Map([[BigInt(0), 'SLLI']]))],
  },
  {
    name: 'SRLI/SRAI',
    condition: {
      field: 'funct3',
      value: BigInt(5),
    },
    fields: [
      shamt6,
      funct6(
        new Map([
          [BigInt(0), 'SRLI'],
          [BigInt(16), 'SRAI'],
        ]),
      ),
    ],
  },
]
