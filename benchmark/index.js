import * as mcpi from "./mcpi.js"
import * as shuffle from "./shuffle.js"

function benchmark(suites) {
  const entries = Object.entries(suites)
  for (const [name, suite] of entries) {
    for (const test of Object.values(suite)) {
      console.log(`Warming up ${name}:${test.name}`)
      for (let i = 0; i < 10; ++i) test()
    }
  }

  const result = {}
  for (const [name, suite] of entries) {
    result[name] = {}

    for (const test of Object.values(suite)) {
      console.log(`Benchmarking ${name}:${test.name}`)
      
      const start = performance.now()
      for (let i = 0; i < 300; ++i) test()
      result[name][test.name] = `${performance.now() - start} ms`
    }
  }

  console.table(result)
}

benchmark({mcpi, shuffle})
