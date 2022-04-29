#!/usr/bin/env node

const Gpio = require('pigpio').Gpio
const arg = require('arg')
const math = require('mathjs')

const args = arg({
  '--help': Boolean,
  '-h': '--help',

  '--samples': Number,
  '-n': '--samples',

  '--delay': Number,
  '-d': '--delay',

  '--cooldown': Number,
  '-c': '--cooldown',

  '--press': Number,
  '-p': '--press',
})

const {
  '--samples': sampleSize = 100,
  '--delay': startDelay = 5,
  '--cooldown': cooldown = 500,
  '--press': keypressDuration = 40,
} = args

console.log({ sampleSize, startDelay, cooldown, keypressDuration })
let startedAt
let stoppedAt
let running = false

let n = 0

let measurements = []

const sButton = new Gpio(4, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  edge: Gpio.EITHER_RISING,
  alert: true,
})

const eButton = new Gpio(17, {
  mode: Gpio.OUTPUT,
  alert: true,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Use alerts to determine how long the LED was turned on
eButton.on('alert', (level, tick) => {
  if (!running && level) {
    startedAt = tick
    running = true
  }
})

sButton.on('alert', (level, tick) => {
  if (running) {
    stoppedAt = tick
    running = false
    n++
    process.stdout.write(`\rprogress: ${n}/${sampleSize}`)
    measurements.push((stoppedAt >> 0) - (startedAt >> 0))
  }
})

const main = async function () {
  console.log(`Starting Measurement in ${startDelay} seconds`)
  await delay(startDelay * 1000 - cooldown)
  console.log('Starting Measurement')

  while (measurements.length < sampleSize) {
    await delay(cooldown)
    eButton.digitalWrite(1)
    await delay(keypressDuration)
    eButton.digitalWrite(0)
  }
  process.stdout.write('\n')

  console.log('average:' + math.mean(measurements))
  console.log('median:' + math.median(measurements))
  console.log('deviation: ' + math.std(measurements))
  console.log('variance: ' + math.variance(measurements))
  console.log('done')
  process.exit(0)
}

main()
