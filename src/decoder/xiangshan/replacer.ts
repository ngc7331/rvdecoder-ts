import type { DecodeExtraInfo, DecodeMode } from '@/types/decoder'

export const genPlruDecoder: (ways: number) => DecodeMode = (ways) => {
  const wayBits = Math.ceil(Math.log2(ways))
  const stateBits = ways - 1
  return {
    name: `${ways}-way PLRU`,
    fields: [
      {
        low: 0,
        high: stateBits - 1,
        name: 'state',
        extra: (value) => {
          const msg: DecodeExtraInfo[] = []

          const state = Number(value) & ((1 << stateBits) - 1)
          let victimNode = 0
          let bit = stateBits - 1
          for (let depth = 0; depth < wayBits; depth++) {
            const nodeNum = 1 << depth
            const wayPerNode = ways / nodeNum
            for (let node = 0; node < nodeNum; node++) {
              const bitValue = (state >> bit) & 1
              const upper = ways - node * wayPerNode
              const lower = ways - (node + 1) * wayPerNode
              const mid = (upper + lower) / 2
              const groups = [
                wayPerNode == 2 ? `${mid}` : `${upper - 1}:${mid}`,
                wayPerNode == 2 ? `${lower}` : `${mid - 1}:${lower}`,
              ]
              if (bitValue === 0) {
                groups.reverse()
              }
              msg.push({
                msg: `bit[${bit}]: way[${groups[0]}] is newer than way[${groups[1]}]`,
                level: 'info',
              })

              if (node === victimNode) {
                victimNode = victimNode * 2 + (bitValue === 0 ? 0 : 1)
              }

              bit--
            }
          }

          msg.push({
            msg: `Victim: way[${ways - 1 - victimNode}]`,
            level: 'info',
          })

          return msg
        },
      },
    ],
  }
}

export const genLruDecoder: (ways: number) => DecodeMode = (ways) => {
  const stateBits = (ways * (ways - 1)) / 2
  return {
    name: `${ways}-way LRU`,
    fields: [
      {
        low: 0,
        high: stateBits - 1,
        name: 'state',
        extra: (value) => {
          const msg: DecodeExtraInfo[] = []

          const state = Number(value) & ((1 << stateBits) - 1)
          const newerCount = Array.from({ length: ways }, () => 0)
          let bit = 0
          for (let j = 0; j < ways; j++) {
            for (let i = j + 1; i < ways; i++) {
              const bitValue = (state >> bit) & 1

              const newer = bitValue ? i : j
              const older = bitValue ? j : i

              msg.push({
                msg: `bit[${bit}]: way[${newer}] is newer than way[${older}]`,
                level: 'info',
              })

              newerCount[older]++

              bit++
            }
          }

          const order = Array.from({ length: ways }, (_, way) => way).sort((a, b) => {
            const newerDiff = newerCount[a] - newerCount[b]
            return newerDiff !== 0 ? newerDiff : a - b
          })

          msg.push({
            msg: `Order: ${order.map((way) => `way[${way}]`).join(' > ')}`,
            level: 'info',
          })

          msg.push({
            msg: `Victim: way[${order[ways - 1]}]`,
            level: 'info',
          })

          return msg
        },
      },
    ],
  }
}
