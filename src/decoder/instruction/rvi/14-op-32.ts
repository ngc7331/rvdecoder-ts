import { DecodeFieldType } from '../../../types/decoder'
import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { rd, rs1, rs2, funct3, funct7 } from './common'

export const op32Fields: (DecodeField | ConditionalDecodeMode)[] = [
  rd,
  rs1,
  rs2,
  funct7(
    new Map([
      [BigInt(0), 'Base'],
      [BigInt(1), 'M-Ext'],
      [BigInt(32), 'Base-alt'],
    ]),
  ),
  {
    name: 'funct7-base',
    condition: { field: 'funct7', value: BigInt(0) },
    fields: [
      funct3(['ADDW', 'SLLW', 'Reserved', 'Reserved', 'Reserved', 'SRLW', 'Reserved', 'Reserved']),
    ],
  },
  {
    name: 'funct7-mext',
    condition: { field: 'funct7', value: BigInt(1) },
    fields: [
      funct3(['MULW', 'Reserved', 'Reserved', 'Reserved', 'DIVW', 'DIVUW', 'REMW', 'REMUW']),
    ],
  },
  {
    name: 'funct7-base-alt',
    condition: { field: 'funct7', value: BigInt(32) },
    fields: [
      funct3([
        'SUBW',
        'Reserved',
        'Reserved',
        'Reserved',
        'Reserved',
        'SRAW',
        'Reserved',
        'Reserved',
      ]),
    ],
  },
  {
    name: 'funct7-reserved',
    condition: {
      field: 'funct7',
      value: Array.from({ length: 128 }, (_, i) => BigInt(i)).filter(
        (v) => v !== BigInt(0) && v !== BigInt(1) && v !== BigInt(32),
      ),
    },
    fields: [funct3()],
  },
  { low: 32, high: 63, type: DecodeFieldType.INVALID },
]
