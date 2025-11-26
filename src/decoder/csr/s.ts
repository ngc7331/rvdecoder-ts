import { DecodeFieldType, type DecodeMode } from '@/types/decoder'
import { renderImm } from '../utils/renderImm'

export const sMode: DecodeMode[] = [
  {
    name: 'satp-rv32',
    fields: [
      {
        low: 0,
        high: 21,
        name: 'PPN',
        extra: (value) => [
          { msg: `PPN = ${renderImm(value & ((1n << 22n) - 1n), 22)}`, level: 'info' },
        ],
      },
      { low: 22, high: 30, name: 'ASID' },
      { low: 31, name: 'MODE', value: ['Bare', 'Sv32'] },
      { low: 32, high: 63, type: DecodeFieldType.INVALID },
    ],
  },
  {
    name: 'satp-rv64',
    fields: [
      {
        low: 0,
        high: 43,
        name: 'PPN',
        extra: (value) => [
          { msg: `PPN = ${renderImm(value & ((1n << 44n) - 1n), 44)}`, level: 'info' },
        ],
      },
      { low: 44, high: 59, name: 'ASID' },
      {
        low: 60,
        high: 63,
        name: 'MODE',
        value: new Map([
          [0n, 'Bare'],
          [8n, 'Sv39'],
          [9n, 'Sv48'],
          [10n, 'Sv57'],
          [11n, 'Reserved for Sv64'],
          [12n, 'Reserved for standard use'],
          [13n, 'Reserved for standard use'],
          [14n, 'Designated for custom use'],
          [15n, 'Designated for custom use'],
        ]),
      },
    ],
  },
]
