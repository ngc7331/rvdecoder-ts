export * from './types'

import { csrDecoders } from './csr'
import type { DecodeCategory } from './types'

export const decoders: DecodeCategory[] = [
  {
    name: 'general',
    items: [
      {
        name: 'general',
        fields: [
          { width: 4, name: 'bits[3:0]' },
          { width: 4, name: 'bits[7:4]' },
          { width: 4, name: 'bits[11:8]' },
          { width: 4, name: 'bits[15:12]' },
          { width: 4, name: 'bits[19:16]' },
          { width: 4, name: 'bits[23:20]' },
          { width: 4, name: 'bits[27:24]' },
          { width: 4, name: 'bits[31:28]' },
          { width: 4, name: 'bits[35:32]' },
          { width: 4, name: 'bits[39:36]' },
          { width: 4, name: 'bits[43:40]' },
          { width: 4, name: 'bits[47:44]' },
          { width: 4, name: 'bits[51:48]' },
          { width: 4, name: 'bits[55:52]' },
          { width: 4, name: 'bits[59:56]' },
          { width: 4, name: 'bits[63:60]' },
        ],
      },
    ],
  },
  {
    name: 'csr',
    items: csrDecoders,
  },
]
