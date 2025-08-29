import { DecodeFieldType } from '../types'
import type { DecodeMode } from '../types'

import { rviFields } from './rvi'

export const instructionDecoders: DecodeMode[] = [
  {
    name: 'instruction',
    fields: [
      { low: 0, high: 1, name: 'opcode[1:0]', value: ['C0', 'C1', 'C2', 'I'] },
      {
        name: 'C0',
        condition: {
          field: 'opcode[1:0]',
          value: BigInt(0),
        },
        fields: [
          { low: 2, high: 15, name: 'TODO' },
          { low: 16, high: 63, type: DecodeFieldType.INVALID },
        ],
      },
      {
        name: 'C1',
        condition: {
          field: 'opcode[1:0]',
          value: BigInt(1),
        },
        fields: [
          { low: 2, high: 15, name: 'TODO' },
          { low: 16, high: 63, type: DecodeFieldType.INVALID },
        ],
      },
      {
        name: 'C2',
        condition: {
          field: 'opcode[1:0]',
          value: BigInt(2),
        },
        fields: [
          { low: 2, high: 15, name: 'TODO' },
          { low: 16, high: 63, type: DecodeFieldType.INVALID },
        ],
      },
      {
        name: 'I',
        condition: {
          field: 'opcode[1:0]',
          value: BigInt(3),
        },
        fields: rviFields,
      },
    ],
  },
]
