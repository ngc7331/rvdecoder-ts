import type { DecodeMode } from '../../types/decoder'

import { rvc0Fields, rvc1Fields, rvc2Fields } from './rvc'
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
        fields: rvc0Fields,
      },
      {
        name: 'C1',
        condition: {
          field: 'opcode[1:0]',
          value: BigInt(1),
        },
        fields: rvc1Fields,
      },
      {
        name: 'C2',
        condition: {
          field: 'opcode[1:0]',
          value: BigInt(2),
        },
        fields: rvc2Fields,
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
