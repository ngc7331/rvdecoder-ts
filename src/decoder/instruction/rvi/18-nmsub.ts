import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'
import { frd, frm, frs1, frs2, frs3, fdestPrecision } from './common'

export const nmsubFields: (DecodeField | ConditionalDecodeMode)[] = [
  frd,
  frm,
  frs1,
  frs2,
  frs3,
  fdestPrecision,
]
