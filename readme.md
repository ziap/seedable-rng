# Seedable RNG

A small JavaScript library for random number generation

## Usage

**Note:** All the examples below uses the PCG-32 random number generator, but
the library also includes an implementation of Xoshiro256+, which has identical
usage. Seed the difference between the generators [below](#generators).

The library is small and modular, so just download and import what you need.
Or you can also download everything and import from `index.js`

```js
import PCG32 from "/path/to/pcg32.js"
import Seed from "/path/to/seed.js"

// or
import { PCG32, Seed } from "/path/to/index.js"
```

## Features

### Generation

The generators output a random value from 0 (inclusive) to 1 (exclusive), so
they can be used as a drop-in replacement for `Math.random`.

```js
// Create a random number generator
const rng = PCG32(new Uint8Array([42]))

// Use it like Math.random
// Example: select a random element from an array
const elem = array[Math.floor(array.length * rng())]
```

### Seeding

You can initialize the RNG with a seed. A seed can be any `Uint8Array` of
arbitrary length.

```js
const seed = new Uint8Array([1, 2, 3, 4, 5])

const rng = PCG32(seed)

rng() // 0.36184210469946265
```

RNGs initialized with the same seed are guaranteed to output the same sequence
of numbers every time.

```js
// seed = ...
const seq = new Array(100)

const rng1 = PCG32(seed)
for (let i = 0; i < seq.length; ++i) seq[i] = rng1()

const rng2 = PCG32(seed)
for (let i = 0; i < seq.length; ++i) console.assert(seq[i] == rng2())
```

### Creating seed

Creating `Uint8Array`s from primitive values can be quite cumbersome, so the
class `Seed` provides some utilities for doing just that.

- `Seed.rand64`: Creates a random 64-bit seed, see [Random seed](#random-seed)
- `Seed.string`: Creates a seed from a string
- `Seed.number`: Creates a seed from a number
- `Seed.default`: Creates an empty seed, the generators will just use their
default configuration

```js
Seed.string("Hello") // [ 72, 101, 108, 108, 111 ]
Seed.number(Math.PI) // [ 24, 45, 68, 84, 251, 33, 9, 64 ]
```

### Random seed

You can also use a random seed (generated from `crypto.getRandomValues`) by not
providing the seed yourself, or by using `Seed.rand64`.

```js
const rng = PCG32()

rng() // Random, change every time you run the code

Seed.rand64() // A random 64-bit seed generated from `crypto.getRandomValues`
```

## Generators

| Generator        | PCG-32     | Xoshiro128 | Xoshiro256                |
| ---------------- | ---------- | ---------- | ------------------------- |
| State size       | 64-bit     | 128-bit    | **256-bit**               |
| Output precision | 32-bit     | 32-bit     | **52-bit**                |
| Speed            | **Fast**   | **Fast**   | Slow                      |

**Note:**
- For speed, look at the [benchmark](#results)
- Large state size often means better statistical quality
- `PCG-32` is the `PCG-XSH-RR 64/32` variant
- `Xoshiro256` is the `Xoshiro256+` variant
- `Xoshiro256` only output 52 bits because the lower bits have bad quality and
are discarded during floating point generation
- `Xoshiro256` is only slow because JavaScript, normally it's much faster
- `Xoshiro128` is the `Xoshiro128**` variant

## Benchmarks

CPU: AMD Ryzen 7 5800U

### Running

On NodeJS and Deno (and probably bun)

```bash
node benchmark
deno run benchmark/index.js
```

On browsers

- Serve the repository with any static site server
- Navigate to `http://localhost:PORT/benchmark`

### Results

Deno (1.36.0)

| Generator      | Math.random | PCG-32      | Xoshiro128 | Xoshiro256 |
| -------------- | ----------- | ----------- | ---------- | ---------- |
| Monte Carlo PI | 4306 ms     | **2142 ms** | 2914 ms    | 12.88 s    |
| Shuffle array  | 3426 ms     | **1682 ms** | 1838 ms    | 8854 ms    |

NodeJS (18.17.1)

| Generator      | Math.random | PCG-32  | Xoshiro128  |Xoshiro256 |
| -------------- | ----------- | ------- | ----------- |---------- |
| Monte Carlo PI | 4118 ms     | 50.81 s | **2914 ms** |305.4 s    |
| Shuffle array  | 3573 ms     | 27.02 s | **1650 ms** |158.7 s    |

Firefox (116.0.3)

| Generator      | Math.random | PCG-32  | Xoshiro128 | Xoshiro256 |
| -------------- | ----------- | ------- | ---------- | ---------- |
| Monte Carlo PI | **1463 ms** | 57.65 s | 10.29 s    | 216.7 s    |
| Shuffle array  | **2048 ms** | 39.48 s | 8782 ms    | 133.0 s    |

Brave (116.1.57.53)

| Generator      | Math.random | PCG-32      | Xoshiro128 | Xoshiro256 |
| -------------- | ----------- | ----------- | ---------- | ---------- |
| Monte Carlo PI | 4090 ms     | **2104 ms** | 2895 ms    | 10.72 s    |
| Shuffle array  | 3212 ms     | **1816 ms** | 1816 ms    | 7341 ms    |

## License

This library is licensed under the [MIT License](LICENSE).
