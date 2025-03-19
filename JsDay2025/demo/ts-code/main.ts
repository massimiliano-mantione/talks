import { argv } from 'node:process';
import { get as getConfiguration, benchmark } from './configuration'
import { checkOrdersData } from './data';

if (!checkOrdersData()) {
  console.log('Data is invalid')
  throw new Error('Data is invalid')
}

const configuration = await getConfiguration(argv[2])
const [timeInMs, result] = await benchmark(configuration)
const iterInUsec = (1000 * timeInMs) / configuration.epoch
console.log(
  `${configuration.name}\ttime ms ${timeInMs}\t iter us ${iterInUsec}\twarmup \t${configuration.warmup}\titer ${configuration.epoch}\t(ok ${result.ok_counter} ko ${result.ko_counter})\ttotal ${result.total}`
)
