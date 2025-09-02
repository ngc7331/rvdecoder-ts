import type { DecodeField, ConditionalDecodeMode } from '@/types/decoder'

import {
  frd,
  frs1,
  frs2,
  frs2Rsvd,
  frm,
  frmRsvd,
  funct3,
  funct2,
  fdestPrecision,
  fsrcPrecision,
  fdestXPrecision,
  fsrcXPrecision,
  fsrcPrecisionUpperRsvd,
} from './common'

const op_FADD = BigInt('0b00000')
const op_FSUB = BigInt('0b00001')
const op_FMUL = BigInt('0b00010')
const op_FDIV = BigInt('0b00011')
const op_FSQRT = BigInt('0b01011')
const op_FSGNJ = BigInt('0b00100')
const op_FMIN_MAX = BigInt('0b00101')
const op_FCVTFF = BigInt('0b01000')
const op_FCVTXF = BigInt('0b11000')
const op_FCVTFX = BigInt('0b11010')
const op_FMVX_CLASS = BigInt('0b11100')
const op_FCMP = BigInt('0b10100')
const op_FMV = BigInt('0b11110')

export const opFpFields: (DecodeField | ConditionalDecodeMode)[] = [
  frd,
  frs1,
  {
    name: 'funct7[6:2]',
    low: 27,
    high: 31,
    value: new Map([
      [op_FADD, 'FADD'],
      [op_FSUB, 'FSUB'],
      [op_FMUL, 'FMUL'],
      [op_FDIV, 'FDIV'],
      [op_FSQRT, 'FSQRT'],
      [op_FSGNJ, 'FSGNJ'],
      [op_FMIN_MAX, 'FMIN/MAX'],
      [op_FCVTFF, 'FCVTFF'],
      [op_FCVTXF, 'FCVTXF'],
      [op_FCVTFX, 'FCVTFX'],
      [op_FMVX_CLASS, 'FMVX/CLASS'],
      [op_FCMP, 'FCMP'],
      [op_FMV, 'FMV'],
    ]),
  },
  {
    name: 'funct7[6:2]-FADD/SUB/MUL/DIV',
    condition: {
      field: 'funct7[6:2]',
      value: [op_FADD, op_FSUB, op_FMUL, op_FDIV],
    },
    fields: [fdestPrecision, frs2, frm],
  },
  {
    name: 'funct7[6:2]-FSGNJ',
    condition: {
      field: 'funct7[6:2]',
      value: op_FSGNJ,
    },
    fields: [fdestPrecision, frs2, funct3(['SGNJ', 'SGNJN', 'SGNJX', 'Reserved'])],
  },
  {
    name: 'funct7[6:2]-FMIN/MAX',
    condition: {
      field: 'funct7[6:2]',
      value: op_FMIN_MAX,
    },
    fields: [fdestPrecision, frs2, funct3(['MIN', 'MAX', 'Reserved', 'Reserved'])],
  },
  {
    name: 'funct7[6:2]-FCVTFF',
    condition: {
      field: 'funct7[6:2]',
      value: op_FCVTFF,
    },
    fields: [fdestPrecision, fsrcPrecision, fsrcPrecisionUpperRsvd, frm],
  },
  {
    name: 'funct7[6:2]-FCVTXF',
    condition: {
      field: 'funct7[6:2]',
      value: op_FCVTXF,
    },
    fields: [fdestPrecision, fsrcXPrecision, fsrcPrecisionUpperRsvd, frm],
  },
  {
    name: 'funct7[6:2]-FCVTFX',
    condition: {
      field: 'funct7[6:2]',
      value: op_FCVTFX,
    },
    fields: [fdestXPrecision, fsrcPrecision, fsrcPrecisionUpperRsvd, frm],
  },
  {
    name: 'funct7[6:2]-FMVX_CLASS',
    condition: {
      field: 'funct7[6:2]',
      value: op_FMVX_CLASS,
    },
    fields: [
      funct3(
        new Map([
          [BigInt('0b000'), 'FMV.X'],
          [BigInt('0b001'), 'FCLASS'],
        ]),
      ),
      frs2Rsvd,
      {
        name: 'funct3-FMV.X',
        condition: { field: 'funct3', value: BigInt('0b000') },
        fields: [funct2(['W', 'D', 'H', 'Reserved'])],
      },
      {
        name: 'funct3-FCLASS',
        condition: { field: 'funct3', value: BigInt('0b001') },
        fields: [fdestPrecision],
      },
    ],
  },
  {
    name: 'funct7[6:2]-FCMP',
    condition: {
      field: 'funct7[6:2]',
      value: op_FCMP,
    },
    fields: [fdestPrecision, frs2, funct3(['LE', 'LT', 'EQ', 'Reserved'])],
  },
  {
    name: 'funct7[6:2]-FMV',
    condition: {
      field: 'funct7[6:2]',
      value: op_FMV,
    },
    fields: [frmRsvd, frs2Rsvd, funct2(['W', 'D', 'H', 'Reserved'])],
  },
  // catch other cases
  {
    name: 'funct7[6:2]-Other',
    condition: {
      field: 'funct7[6:2]',
      value: Array.from({ length: 32 }, (_, i) => BigInt(i)).filter(
        (v) =>
          v !== op_FADD &&
          v !== op_FSUB &&
          v !== op_FMUL &&
          v !== op_FDIV &&
          v !== op_FSQRT &&
          v !== op_FSGNJ &&
          v !== op_FMIN_MAX &&
          v !== op_FCVTFF &&
          v !== op_FCVTXF &&
          v !== op_FCVTFX &&
          v !== op_FMVX_CLASS &&
          v !== op_FCMP &&
          v !== op_FMV,
      ),
    },
    fields: [fdestPrecision, frs2, funct3(['Other', 'Reserved'])],
  },
]
