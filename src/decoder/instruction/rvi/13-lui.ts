import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, immU } from './common'

export const luiFields: (DecodeField | ConditionalDecodeMode)[] = [rd, ...immU]
