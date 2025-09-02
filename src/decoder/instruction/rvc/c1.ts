import { DecodeFieldType } from '../../../types/decoder'
import type { DecodeField, ConditionalDecodeMode, DecodeExtraInfo } from '../../../types/decoder'
import {
  funct3,
  funct2H,
  funct2L,
  funct4_0,
  rs1rd,
  rd,
  rs1s,
  rs2s,
  rs1srds,
  immCI1,
  uimmCI1,
  immCI2,
  immCI3,
  immCJ,
  immCB,
  rdIsZero,
  rdIssp,
  immCIIsZero,
} from './common'

export const rvc1Fields: (DecodeField | ConditionalDecodeMode)[] = [
  funct3(['ADDI', 'ADDIW', 'LI', 'LUI/ADDI16SP', 'OP', 'J', 'BEQZ', 'BNEZ']),
  {
    name: 'funct3-ADDI',
    condition: {
      field: 'funct3',
      value: BigInt(0),
    },
    fields: [
      {
        ...rs1rd,
        extra: (value) => {
          const msgs: DecodeExtraInfo[] = []

          if (immCIIsZero(value)) msgs.push({ msg: `C.ADDI with imm=0 is a HINT`, level: 'info' })

          if (rdIsZero(value)) msgs.push({ msg: `C.ADDI with rs1/rd=0 is a NOP`, level: 'info' })

          return msgs
        },
      },
      ...immCI1,
    ],
  },
  {
    name: 'funct3-ADDIW',
    condition: {
      field: 'funct3',
      value: BigInt(1),
    },
    fields: [
      {
        ...rs1rd,
        extra: (value) => {
          return rdIsZero(value)
            ? [{ msg: `C.ADDIW with rs1/rd=0 is Reserved`, level: 'error' }]
            : []
        },
      },
      ...immCI1,
    ],
  },
  {
    name: 'funct3-LI',
    condition: {
      field: 'funct3',
      value: BigInt(2),
    },
    fields: [
      {
        ...rd,
        extra: (value) => {
          return rdIsZero(value) ? [{ msg: `C.LI with rd=0 is a HINT`, level: 'info' }] : []
        },
      },
      ...immCI1,
    ],
  },
  {
    name: 'funct3-LUI/ADDI16SP',
    condition: {
      field: 'funct3',
      value: BigInt(3),
    },
    fields: [
      {
        ...rd,
        extra: (value) => {
          const msgs: DecodeExtraInfo[] = []
          if (immCIIsZero(value))
            msgs.push({ msg: `C.LUI/ADDI16SP with imm=0 is Reserved`, level: 'error' })
          if (rdIsZero(value)) msgs.push({ msg: `C.LUI with rd=0 is a HINT`, level: 'info' })
          if (rdIssp(value)) msgs.push({ msg: `C.LUI with rd=2 is C.ADDI16SP`, level: 'info' })
          return msgs
        },
      },
      {
        name: 'ADDI16SP',
        condition: {
          field: 'rd',
          value: BigInt(2),
        },
        fields: [...immCI2],
      },
      {
        name: 'LUI',
        condition: {
          field: 'rd',
          value: Array.from({ length: 32 }, (_, i) => BigInt(i)).filter((i) => i !== 2n),
        },
        fields: [...immCI3],
      },
    ],
  },
  {
    name: 'funct3-OP',
    condition: {
      field: 'funct3',
      value: BigInt(4),
    },
    fields: [
      funct2H(['SRLI', 'SRAI', 'ANDI', 'R']),
      {
        ...rs1srds,
        extra: (value) => {
          const funct2HValue = (value >> 10n) & 0x3n
          return (funct2HValue === 0n || funct2HValue === 1n) && immCIIsZero(value)
            ? [{ msg: `C.SRLI/SRAI with uimm=0 is a HINT`, level: 'info' }]
            : []
        },
      },
      {
        name: 'funct2H-SRLI/SRAI',
        condition: {
          field: 'funct2H',
          value: [BigInt(0), BigInt(1)],
        },
        fields: [...uimmCI1],
      },
      {
        name: 'funct2H-ANDI',
        condition: {
          field: 'funct2H',
          value: BigInt(2),
        },
        fields: [...immCI1],
      },
      {
        name: 'funct2H-R',
        condition: {
          field: 'funct2H',
          value: BigInt(3),
        },
        fields: [
          funct4_0(['D', 'W']),
          rs2s,
          {
            name: 'funct4[0]-D',
            condition: {
              field: 'funct4[0]',
              value: BigInt(0),
            },
            fields: [funct2L(['SUB', 'XOR', 'OR', 'AND'])],
          },
          {
            name: 'funct4[0]-W',
            condition: {
              field: 'funct4[0]',
              value: BigInt(1),
            },
            fields: [funct2L(['SUBW', 'ADDW', 'Reserved', 'Reserved'])],
          },
        ],
      },
    ],
  },
  {
    name: 'funct3-J',
    condition: {
      field: 'funct3',
      value: BigInt(5),
    },
    fields: [...immCJ],
  },
  {
    name: 'funct3-BEQZ',
    condition: {
      field: 'funct3',
      value: BigInt(6),
    },
    fields: [rs1s, ...immCB],
  },
  {
    name: 'funct3-BNEZ',
    condition: {
      field: 'funct3',
      value: BigInt(7),
    },
    fields: [rs1s, ...immCB],
  },
  { low: 16, high: 63, type: DecodeFieldType.INVALID },
]
