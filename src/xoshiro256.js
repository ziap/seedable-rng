/**
 * Creates a Xoshiro256+ random number generator.
 * The generator can generate a float in the half-open interval [0, 1).
 * It can be a drop-in replacement for Math.random in case you need a high
 * quality, seedable, albeit slow (due to JavaScript) random number generator.
 *
 * I implement Xoshiro256+ instead of Xoshiro256** because it's faster and the
 * bad low bits are discarded when converting to floating point anyways.
 *
 * @param {Uint8Array} [seed] - The byte sequence used to seed the RNG.
 * If not provided, uses random bytes from `crypto.getRandomValues`.
 */
export default function Xoshiro256(seed) {
  // Allocate 1 extra element to store the result
  // It's required because of floating point bit manipulation
  // There's no union in JavaScript so the only way to do it is via typed array
  // But typed array creation is slow it has to be preallocated
  const state = new BigUint64Array(5)
  const result = new Float64Array(state.buffer)

  if (seed) {
    // Hash the seed with FNV-1a, store it in the result element
    // It's required to prevent starting from a state with a large fraction of
    // bits set to zero which is impossible to escape from for shift-register
    // generators, while retaining the property of randomizing long strings
    state[4] = 0xcbf29ce484222325n
    for (let i = 0; i < seed.length; ++i) {
      state[4] ^= BigInt(seed[i])
      state[4] *= 0x100000001b3n
    }

    // Seed the states using SplitMix64
    for (let i = 0; i < 4; ++i) {
      state[4] += 0x9e3779b97f4a7c15n
      state[i] = state[4]
      state[i] ^= state[i] >> 30n
      state[i] *= 0xbf58476d1ce4e5b9n
      state[i] ^= state[i] >> 27n
      state[i] *= 0x94d049bb133111ebn
      state[i] ^= state[i] >> 31n
    }
  } else {
    crypto.getRandomValues(state.subarray(0, 4))
  }

  return () => {
    // Fill the mantissa with random bits
    state[4] = state[0] + state[3]
    state[4] >>= 12n

    // Set the exponent to 0
    // Now the result element contains a random number in the range [2^0, 2^1)
    state[4] |= 0x3ff0000000000000n

    const t = state[1] << 17n

    state[2] ^= state[0]
    state[3] ^= state[1]
    state[1] ^= state[2]
    state[0] ^= state[3]
    
    state[2] ^= t
    state[3] = (state[3] << 45n) | (state[3] >> 19n)

    // Move the range down to [0, 1)
    return result[4] - 1
  }
}
