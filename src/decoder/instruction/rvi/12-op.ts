import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, rs1, rs2, funct3, funct7 } from './common'

export const opFields: (DecodeField | ConditionalDecodeMode)[] = [
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
    fields: [funct3(['ADD', 'SLL', 'SLT', 'SLTU', 'XOR', 'SRL', 'OR', 'AND'])],
  },
  {
    name: 'funct7-mext',
    condition: { field: 'funct7', value: BigInt(1) },
    fields: [funct3(['MUL', 'MULH', 'MULHSU', 'MULHU', 'DIV', 'DIVU', 'REM', 'REMU'])],
  },
  {
    name: 'funct7-base-alt',
    condition: { field: 'funct7', value: BigInt(32) },
    fields: [
      funct3([
        'SUB',
        'Reserved',
        'Reserved',
        'Reserved',
        'Reserved',
        'SRA',
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
]
