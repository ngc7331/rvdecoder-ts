import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, rs1, immI, funct3, rdRsvd, rs1Rsvd } from './common'

export const miscMemFields: (DecodeField | ConditionalDecodeMode)[] = [
  funct3([
    'FENCE',
    'FENCE.I',
    'Reserved',
    'Reserved',
    'Reserved',
    'Reserved',
    'Reserved',
    'Reserved',
  ]),
  {
    name: 'funct3-FENCE',
    condition: {
      field: 'funct3',
      value: BigInt('0b000'),
    },
    fields: [
      rd,
      rs1,
      { name: 'SW', low: 20 },
      { name: 'SR', low: 21 },
      { name: 'SO', low: 22 },
      { name: 'SI', low: 23 },
      { name: 'PW', low: 24 },
      { name: 'PR', low: 25 },
      { name: 'PO', low: 26 },
      { name: 'PI', low: 27 },
      { name: 'fm', low: 28, high: 31 },
    ],
  },
  {
    name: 'funct3-FENCEI',
    condition: {
      field: 'funct3',
      value: BigInt('0b001'),
    },
    fields: [rd, rs1, ...immI],
  },
  {
    name: 'funct3-Reserved',
    condition: {
      field: 'funct3',
      value: [
        BigInt('0b010'),
        BigInt('0b011'),
        BigInt('0b100'),
        BigInt('0b101'),
        BigInt('0b110'),
        BigInt('0b111'),
      ],
    },
    fields: [
      rdRsvd,
      rs1Rsvd,
      {
        type: DecodeFieldType.RESERVED,
        low: 20,
        high: 31,
      },
    ],
  },
]
