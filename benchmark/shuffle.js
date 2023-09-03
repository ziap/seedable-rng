import { PCG32, Xoshiro256, Seed } from "../src/index.js"

const pcg = PCG32(Seed.default())
const xoshiro = Xoshiro256(Seed.default())

/**
 * @type {number[]}
 */
const array = new Array(1e6)
for (let i = 0; i < array.length; ++i) array[i] = i

export function MathRandom() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}

export function PCG() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(pcg() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}

export function Xoshiro() {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(xoshiro() * (i + 1))

    const x = array[j]
    array[j] = array[i]
    array[i] = x
  }
}
