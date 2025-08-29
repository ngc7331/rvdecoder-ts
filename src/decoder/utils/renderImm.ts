export const renderImm = (value: bigint, bits: number, signed: boolean = true) => {
  // Original hexadecimal
  const originalHex = `0x${value.toString(16)}`

  let extendedValue: bigint
  let decimalValue: bigint

  if (signed) {
    // Sign extension to 64 bits
    const signBit = (value >> BigInt(bits - 1)) & 1n

    if (signBit === 1n) {
      // Negative number: fill high bits with 1
      const mask = (1n << BigInt(64 - bits)) - 1n
      extendedValue = value | (mask << BigInt(bits))
    } else {
      // Positive number: keep original value (high bits are already 0)
      extendedValue = value
    }

    // Convert 64-bit unsigned number to signed number
    decimalValue = extendedValue >= 1n << 63n ? extendedValue - (1n << 64n) : extendedValue
  } else {
    // Unsigned extension to 64 bits (zero extension)
    extendedValue = value
    decimalValue = value
  }

  // Extended hexadecimal
  const extendedHex = `0x${extendedValue.toString(16).padStart(16, '0')}`

  return `${originalHex} → ${extendedHex} (${decimalValue})`
}
