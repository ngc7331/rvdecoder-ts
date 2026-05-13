import type { DecodeMode } from '@/types/decoder'

import { genPlruDecoder, genLruDecoder } from './replacer'

export const xiangshanDecoders: DecodeMode[] = [
  genPlruDecoder(2),
  genPlruDecoder(4),
  genPlruDecoder(8),
  genPlruDecoder(16),
  genLruDecoder(2),
  genLruDecoder(4),
  genLruDecoder(8),
  genLruDecoder(16),
]
