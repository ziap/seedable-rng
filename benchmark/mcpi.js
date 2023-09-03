import { PCG32, Xoshiro256, Seed } from "../src/index.js"

const pcg = PCG32(Seed.default())
const xoshiro = Xoshiro256(Seed.default())

const TOTAL = 1e6

export function MathRandom() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = Math.random()
    let y = Math.random()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}

export function Xoshiro() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = xoshiro()
    let y = xoshiro()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}

export function PCG() {
  let hit = 0
  for (let i = 0; i < TOTAL; ++i) {
    let x = pcg()
    let y = pcg()

    if (x * x + y * y <= 1) ++hit
  }

  return 4 * hit / TOTAL
}
