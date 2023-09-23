import { PCG32, Xoshiro256, Xoshiro128, Seed } from "../src/index.js"

const rng_pcg32 = PCG32(Seed.default())
const rng_xoshiro256 = Xoshiro256(Seed.default())
const rng_xoshiro128 = Xoshiro128(Seed.default())

const TOTAL = 1e6

export function math_random() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = Math.random()
    let y = Math.random()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}

export function xoshiro256() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = rng_xoshiro256()
    let y = rng_xoshiro256()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}

export function xoshiro128() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = rng_xoshiro128()
    let y = rng_xoshiro128()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}

export function pcg32() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = rng_pcg32()
    let y = rng_pcg32()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}
