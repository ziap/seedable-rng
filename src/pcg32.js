const IS_LITTLE_EDIAN = (() => {
  const array = new Uint16Array(1)
  const words = new Uint8Array(array.buffer)
  array[0] = 0xff

  // little: words = [0xff, 0x00]
  // big:    words = [0x00, 0xff]
  return !words[1]
})()

const LO_WORD = IS_LITTLE_EDIAN ? 0 : 1
const HI_WORD = IS_LITTLE_EDIAN ? 1 : 0

// Constants used by Donald Knuth for his Linear congruential generator.
const MUL = 0x5851f42d4c957f2dn
const INC = 0x14057b7ef767814fn

/**
 * Creates a 32-bit Permuted congruential generator.
 * The generator can generate a float in the half-open interval [0, 1).
 * It can be a drop-in replacement for Math.random in case you need a high
 * performance, seedable, albeit short period random number generator.
 *
 * @param {Uint8Array} [seed] - The byte sequence used to seed the RNG.
 * If not provided, uses random bytes from `crypto.getRandomValues`.
   */
export default function PCG32(seed) {
  // Storing the state in a BigUint64Array instead of just a Bigint because
  // - Automatic wrapping (no % 2^64 or its bitwise equivalent)
  // - (Hopefully) the runtime will optimize this into fast 64-bit operations
  let state = new BigUint64Array([0xcafef00dd15ea5e5n])
  let state_view = new Uint32Array(state.buffer)

  if (seed) {
    // Pad the seed so that it's 8-byte aligned
    const offset = seed.length % 8
    if (offset) {
      const padded = new Uint8Array(seed.length + 8 - offset)
      padded.set(seed)

      seed = padded
    }

    // Even though the state is only 64-bit, we still have to iterate over all
    // chunks to randomize long strings with the RNG itself without using
    // another hash function
    const chunks = new BigUint64Array(seed.buffer)
    for (let i = 0; i < chunks.length; ++i) {
      state[0] += chunks[i]
      state[0] *= MUL
      state[0] += INC
    }
  } else {
    crypto.getRandomValues(state)
  }

  return () => {
    // Split the state in two and do bitwise operations on each parts
    // individually because fast 64-bit bitwise operations are not avaiable for
    // JavaScript (even with BigUint64Array)
    const old_lo = state_view[LO_WORD]
    const old_hi = state_view[HI_WORD]

    state[0] *= MUL
    state[0] += INC

    // old_state ^ (old_state >> 18)
    const xor_lo = ((old_lo >>> 18) | (old_hi << (32 - 18))) ^ old_lo
    const xor_hi = (old_hi >>> 18) ^ old_hi

    // (old_state ^ (old_state >> 18)) >> 27
    const xorshifted = ((xor_lo >>> 27) | (xor_hi << (32 - 27)))

    // old_state >> 59
    const rot = old_hi >>> (59 - 32)

    const permuted = (xorshifted >>> rot) | (xorshifted << (-rot & 31))

    // >>> 0 to convert from i32 to u32
    // Somehow this is faster than floating point bit manipulation
    return (permuted >>> 0) / 0x100000000
  }
}
