/**
 * Convenient utilities for generating seeds.
 * This class creates byte array from primitive values, which can be annoying.
 */
export default class Seed {
  static #encoder = new TextEncoder()
  static #bytes = new Uint8Array(8)
  static #float = new Float64Array(this.#bytes.buffer)

  static #empty = new Uint8Array(0)

  /**
   * Explicitly create a random 64-bit seed.
   */
  static rand64() {
    crypto.getRandomValues(Seed.#bytes)
    return Seed.#bytes.slice()
  }

  /**
   * Create a seed from a string by encoding it to a utf-8 array.
   * Uses a `TextEncoder` under the hood.
   * @param {string} s
   */
  static string(s) {
    return this.#encoder.encode(s)
  }

  /**
   * Create a seed from a string by getting its double precision floating point
   * binary representation.
   * @param {number} n
   */
  static number(n) {
    Seed.#float[0] = n
    return Seed.#bytes.slice()
  }

  /**
   * Returns an empty seed (length of 0).
   */
  static default() {
    return this.#empty
  }
}
