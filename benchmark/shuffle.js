import { PCG32, Xoshiro256, Xoshiro128, Seed } from "../src/index.js"

const rng_pcg32 = PCG32(Seed.default())
const rng_xoshiro256 = Xoshiro256(Seed.default())
const rng_xoshiro128 = Xoshiro128(Seed.default())

/**
 * @type {number[]}
 */
const array = new Array(1e6)
for (let i = 0; i < array.length; ++i) array[i] = i

export function math_random() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}

export function xoshiro256() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(rng_xoshiro256() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}

export function xoshiro128() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(rng_xoshiro128() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}

export function pcg32() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(rng_pcg32() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}
