import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'
import {
  funct3,
  rds1,
  rs1s,
  rs2s,
  frds1,
  frs2s,
  uimmCIW,
  uimmCLS1,
  uimmCLS2,
  uimmCIWIsZero,
} from './common'

export const rvc0Fields: (DecodeField | ConditionalDecodeMode)[] = [
  funct3(['ADDI4SPN', 'FLD', 'LW', 'LD', 'Reserved', 'FSD', 'SW', 'SD']),
  {
    name: 'funct3-ADDI4SPN',
    condition: {
      field: 'funct3',
      value: BigInt(0),
    },
    fields: [
      {
        ...rds1,
        extra: (value) => {
          return uimmCIWIsZero(value)
            ? [{ msg: 'C.ADDI4SPN with uimm=0 is Reserved', level: 'error' }]
            : []
        },
      },
      ...uimmCIW,
    ],
  },
  {
    name: 'funct3-FLD',
    condition: {
      field: 'funct3',
      value: BigInt(1),
    },
    fields: [frds1, rs1s, ...uimmCLS2],
  },
  {
    name: 'funct3-LW',
    condition: {
      field: 'funct3',
      value: BigInt(2),
    },
    fields: [rds1, rs1s, ...uimmCLS1],
  },
  {
    name: 'funct3-LD',
    condition: {
      field: 'funct3',
      value: BigInt(3),
    },
    fields: [rds1, rs1s, ...uimmCLS2],
  },
  {
    name: 'funct3-Reserved',
    condition: {
      field: 'funct3',
      value: BigInt(4),
    },
    fields: [{ low: 2, high: 12, type: DecodeFieldType.RESERVED }],
  },
  {
    name: 'funct3-FSD',
    condition: {
      field: 'funct3',
      value: BigInt(5),
    },
    fields: [frs2s, rs1s, ...uimmCLS2],
  },
  {
    name: 'funct3-SW',
    condition: {
      field: 'funct3',
      value: BigInt(6),
    },
    fields: [rs2s, rs1s, ...uimmCLS1],
  },
  {
    name: 'funct3-SD',
    condition: {
      field: 'funct3',
      value: BigInt(7),
    },
    fields: [rs2s, rs1s, ...uimmCLS2],
  },
  { low: 16, high: 63, type: DecodeFieldType.INVALID },
]
