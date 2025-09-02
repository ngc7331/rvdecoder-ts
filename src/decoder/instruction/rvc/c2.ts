import { DecodeFieldType } from '@/types/decoder'
import type { DecodeField, ConditionalDecodeMode, DecodeExtraInfo } from '@/types/decoder'

import {
  funct3,
  funct4_0,
  rs1rd,
  rd,
  frd,
  rs1,
  rs2,
  frs2,
  uimmCSL1,
  uimmCSL2,
  uimmCSS1,
  uimmCSS2,
  rdIsZero,
  immCIIsZero,
  uimmCI1,
} from './common'

export const rvc2Fields: (DecodeField | ConditionalDecodeMode)[] = [
  funct3(['SLLI', 'FLDSP', 'LWSP', 'LDSP', 'OP', 'FSDSP', 'SWSP', 'SDSP']),
  {
    name: 'funct3-SLLI',
    condition: {
      field: 'funct3',
      value: BigInt(0),
    },
    fields: [
      {
        ...rs1rd,
        extra: (value) => {
          const msgs: DecodeExtraInfo[] = []
          if (immCIIsZero(value)) msgs.push({ msg: `C.SLLI with imm=0 is a HINT`, level: 'info' })
          if (rdIsZero(value)) msgs.push({ msg: `C.SLLI with rs1/rd=0 is a HINT`, level: 'info' })
          return msgs
        },
      },
      ...uimmCI1,
    ],
  },
  {
    name: 'funct3-FLDSP',
    condition: {
      field: 'funct3',
      value: BigInt(1),
    },
    fields: [frd, ...uimmCSL2],
  },
  {
    name: 'funct3-LWSP',
    condition: {
      field: 'funct3',
      value: BigInt(2),
    },
    fields: [
      {
        ...rd,
        extra: (value) => {
          return rdIsZero(value) ? [{ msg: `C.LWSP with rd=0 is Reserved`, level: 'error' }] : []
        },
      },
      ...uimmCSL1,
    ],
  },
  {
    name: 'funct3-LDSP',
    condition: {
      field: 'funct3',
      value: BigInt(3),
    },
    fields: [
      {
        ...rd,
        extra: (value) => {
          return rdIsZero(value) ? [{ msg: `C.LDSP with rd=0 is Reserved`, level: 'error' }] : []
        },
      },
      ...uimmCSL2,
    ],
  },
  {
    name: 'funct3-OP',
    condition: {
      field: 'funct3',
      value: BigInt(4),
    },
    fields: [
      funct4_0(['JR/MV', 'EBREAK/JALR/ADD']),
      {
        name: 'funct4[0]-JR/MV',
        condition: {
          field: 'funct4[0]',
          value: BigInt(0),
        },
        fields: [
          rs2,
          {
            name: 'rs2Zero',
            condition: {
              field: 'rs2',
              value: BigInt(0),
            },
            fields: [
              {
                ...rs1,
                extra: (value) => {
                  const msgs: DecodeExtraInfo[] = [
                    { msg: 'C.JR/MV with rs2=0 is C.JR', level: 'info' },
                  ]
                  if (rdIsZero(value))
                    msgs.push({ msg: `C.JR with rs1=0 is Reserved`, level: 'error' })
                  return msgs
                },
              },
            ],
          },
          {
            name: 'rs2NonZero',
            condition: {
              field: 'rs2',
              value: Array.from({ length: 32 }, (_, i) => BigInt(i)).filter((i) => i !== 0n),
            },
            fields: [
              {
                ...rd,
                extra: (value) => {
                  const msgs: DecodeExtraInfo[] = [
                    { msg: 'C.JR/MV with rs2!=0 is C.MV', level: 'info' },
                  ]
                  if (rdIsZero(value)) msgs.push({ msg: `C.MV with rd=0 is a HINT`, level: 'info' })
                  return msgs
                },
              },
            ],
          },
        ],
      },
      {
        name: 'funct4[0]-EBREAK/JALR/ADD',
        condition: {
          field: 'funct4[0]',
          value: BigInt(1),
        },
        fields: [
          rs2,
          {
            name: 'rs2Zero',
            condition: {
              field: 'rs2',
              value: BigInt(0),
            },
            fields: [
              {
                ...rs1rd,
                extra: (value) => {
                  return rdIsZero(value)
                    ? [
                        {
                          msg: 'C.EBREAK/JALR/ADD with rs1/rd=0 & rs2=0 is C.EBREAK',
                          level: 'info',
                        },
                      ]
                    : [{ msg: 'C.EBREAK/JALR/ADD with rs1/rd!=0 & rs2=0 is C.JALR', level: 'info' }]
                },
              },
            ],
          },
          {
            name: 'rs2NonZero',
            condition: {
              field: 'rs2',
              value: Array.from({ length: 32 }, (_, i) => BigInt(i)).filter((i) => i !== 0n),
            },
            fields: [
              {
                ...rs1rd,
                extra: (value) => {
                  const msgs: DecodeExtraInfo[] = [
                    { msg: 'C.EBREAK/JALR/ADD with rs2!=0 is C.ADD', level: 'info' },
                  ]
                  if (rdIsZero(value))
                    msgs.push({ msg: `C.ADD with rs1/rd=0 is a HINT`, level: 'info' })
                  return msgs
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'funct3-FSDSP',
    condition: {
      field: 'funct3',
      value: BigInt(5),
    },
    fields: [frs2, ...uimmCSS2],
  },
  {
    name: 'funct3-SWSP',
    condition: {
      field: 'funct3',
      value: BigInt(6),
    },
    fields: [rs2, ...uimmCSS1],
  },
  {
    name: 'funct3-SDSP',
    condition: {
      field: 'funct3',
      value: BigInt(7),
    },
    fields: [rs2, ...uimmCSS2],
  },
  { low: 16, high: 63, type: DecodeFieldType.INVALID },
]
