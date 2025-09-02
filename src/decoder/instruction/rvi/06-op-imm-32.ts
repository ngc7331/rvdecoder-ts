import type { DecodeField, ConditionalDecodeMode } from '@/types/decoder'

import { rd, rs1, funct3, immI, shamt5, funct7 } from './common'

export const opImm32Fields: (DecodeField | ConditionalDecodeMode)[] = [
  rd,
  rs1,
  funct3([
    'ADDIW',
    'SLLIW',
    'Reserved',
    'Reserved',
    'Reserved',
    'SRLIW/SRAIW',
    'Reserved',
    'Reserved',
  ]),
  {
    name: 'other',
    condition: {
      field: 'funct3',
      value: [BigInt(0), BigInt(2), BigInt(3), BigInt(4), BigInt(6), BigInt(7)],
    },
    fields: immI,
  },
  {
    name: 'SLLIW',
    condition: {
      field: 'funct3',
      value: BigInt(1),
    },
    fields: [shamt5, funct7(new Map([[BigInt(0), 'SLLI']]))],
  },
  {
    name: 'SRLIW/SRAIW',
    condition: {
      field: 'funct3',
      value: BigInt(5),
    },
    fields: [
      shamt5,
      funct7(
        new Map([
          [BigInt(0), 'SRLI'],
          [BigInt(32), 'SRAI'],
        ]),
      ),
    ],
  },
]
