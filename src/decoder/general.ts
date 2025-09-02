import type { DecodeMode } from '@/types/decoder'

export const generalDecoders: DecodeMode[] = [
  {
    name: 'general',
    fields: [
      { low: 0, high: 3, name: 'bits[3:0]' },
      { low: 4, high: 7, name: 'bits[7:4]' },
      { low: 8, high: 11, name: 'bits[11:8]' },
      { low: 12, high: 15, name: 'bits[15:12]' },
      { low: 16, high: 19, name: 'bits[19:16]' },
      { low: 20, high: 23, name: 'bits[23:20]' },
      { low: 24, high: 27, name: 'bits[27:24]' },
      { low: 28, high: 31, name: 'bits[31:28]' },
      { low: 32, high: 35, name: 'bits[35:32]' },
      { low: 36, high: 39, name: 'bits[39:36]' },
      { low: 40, high: 43, name: 'bits[43:40]' },
      { low: 44, high: 47, name: 'bits[47:44]' },
      { low: 48, high: 51, name: 'bits[51:48]' },
      { low: 52, high: 55, name: 'bits[55:52]' },
      { low: 56, high: 59, name: 'bits[59:56]' },
      { low: 60, high: 63, name: 'bits[63:60]' },
    ],
  },
]
