export * from './types'

import { generalDecoders } from './general'
import { csrDecoders } from './csr'
import { instructionDecoders } from './instruction'
import type { DecodeCategory } from './types'

export const decoders: DecodeCategory[] = [
  {
    name: 'general',
    items: generalDecoders,
  },
  {
    name: 'instruction',
    items: instructionDecoders,
  },
  {
    name: 'csr',
    items: csrDecoders,
  },
]
