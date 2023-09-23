/**
 * Creates a `Xoshiro128**` random number generator.
 * The generator can generate a float in the half-open interval [0, 1).
 * It can be a drop-in replacement for `Math.random` in case you need a high
 * quality, seedable, albeit slow (due to JavaScript) random number generator.
 *
 * @param {Uint8Array} [seed] - The byte sequence used to seed the RNG.
 * If not provided, uses random bytes from `crypto.getRandomValues`.
 */
export default function Xoshiro128(seed) {
  // Allocate 1 extra element to store the result
  // It's required because of floating point bit manipulation
  // There's no union in JavaScript so the only way to do it is via typed array
  // But typed array creation is slow it has to be preallocated
  const state = new Uint32Array(4)
  const state_view = new BigUint64Array(state.buffer)

  if (seed) {
    // Hash the seed with FNV-1a, store it in the result element
    // It's required to prevent starting from a state with a large fraction of
    // bits set to zero which is impossible to escape from for shift-register
    // generators, while retaining the property of randomizing long strings
    // TODO: Switch to Murmur3, somehow directly hash the seed to 128 bit
    let seed_n = 0xcbf29ce484222325n
    for (let i = 0; i < seed.length; ++i) {
      seed_n ^= BigInt(seed[i])
      seed_n *= 0x100000001b3n
      seed_n &= 0xffffffffffffffffn
    }

    // Seed the states using SplitMix64
    for (let i = 0; i < 2; ++i) {
      seed_n += 0x9e3779b97f4a7c15n
      seed_n &= 0xffffffffffffffffn

      state_view[i] = seed_n
      state_view[i] ^= state_view[i] >> 30n
      state_view[i] *= 0xbf58476d1ce4e5b9n
      state_view[i] ^= state_view[i] >> 27n
      state_view[i] *= 0x94d049bb133111ebn
      state_view[i] ^= state_view[i] >> 31n
    }
  } else {
    crypto.getRandomValues(state)
  }

  return () => {
    let result = (state[1] * 5) >>> 0
    result = (result << 7) | (result >>> 25)
    result = (result >>> 0) * 9

    const t = state[1] << 9

    state[2] ^= state[0]
    state[3] ^= state[1]
    state[1] ^= state[2]
    state[0] ^= state[3]
    
    state[2] ^= t
    state[3] = (state[3] << 11) | (state[3] >>> 21)

    return (result >>> 0) / 0x100000000
  }
}
