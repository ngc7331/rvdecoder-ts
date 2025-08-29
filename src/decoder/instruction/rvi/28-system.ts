import { DecodeFieldType } from '../../types'
import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, rs1, uimm, csr, funct3, rdRsvd, rs1Rsvd } from './common'

export const systemFields: (DecodeField | ConditionalDecodeMode)[] = [
  funct3(['SYSTEM', 'CSRRW', 'CSRRS', 'CSRRC', 'Reserved', 'CSRRWI', 'CSRRSI', 'CSRRCI']),
  {
    name: 'funct3-SYSTEM',
    condition: { field: 'funct3', value: BigInt('0b000') },
    fields: [
      {
        name: 'CMD',
        low: 20,
        high: 31,
        value: new Map([
          [BigInt('0b000000000000'), 'ECALL'],
          [BigInt('0b000000000001'), 'EBREAK'],
          [BigInt('0b000000001101'), 'WRS.NTO'],
          [BigInt('0b000000011101'), 'WRS.STO'],
        ]),
      },
      rdRsvd,
      rs1Rsvd,
    ],
  },
  {
    name: 'funct3-CSR',
    condition: { field: 'funct3', value: [BigInt('0b001'), BigInt('0b010'), BigInt('0b011')] },
    fields: [rd, rs1, csr],
  },
  {
    name: 'funct3-Reserved',
    condition: { field: 'funct3', value: BigInt('0b100') },
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
  {
    name: 'funct3-CSRI',
    condition: { field: 'funct3', value: [BigInt('0b101'), BigInt('0b110'), BigInt('0b111')] },
    fields: [rd, uimm, csr],
  },
]
