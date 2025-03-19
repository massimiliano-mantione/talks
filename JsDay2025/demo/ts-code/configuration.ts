import processorPromise from './processOrderPromise.ts'
import processorSync from './processOrderSync.ts'
import processorAsync from './processOrderAsync.ts'
import processorCb from './processOrderCb.ts'
import processorCbAsync from './processOrderCbAsync.ts'
import processorFp from './processOrderFp.ts'
import processorFpSync from './processOrderFpSync.ts'
import processorFpChecked from './processOrderFpChecked.ts'
import processorFpNew from './processOrderFpNew.ts'
import processorFpSyncNew from './processOrderFpSyncNew.ts'
import processorFpCheckedNew from './processOrderFpCheckedNew.ts'
import processorEffectSync from './processOrderEffectSync.ts'
import { SyncProcessor, AsyncProcessor } from './api.ts'
import { validKey, invalidKey } from './data.ts'

import config_file from "./params.json" with { type: "json" };
const config = config_file as {
  warmup: number
  epoch: number
  failureRate: number
}

function getAsyncProcessor(processorName: string): AsyncProcessor | null {
  if (processorName === 'promise') return processorPromise
  if (processorName === 'async') return processorAsync
  if (processorName === 'cb') return processorCb
  if (processorName === 'cbasync') return processorCbAsync
  if (processorName === 'fp') return processorFp
  if (processorName === 'fpchk') return processorFpChecked
  if (processorName === 'fpn') return processorFpNew
  if (processorName === 'fpchkn') return processorFpCheckedNew
  return null
}
function getSyncProcessor(processorName: string): SyncProcessor | null {
  if (processorName === 'sync') return processorSync
  if (processorName === 'syncfp') return processorFpSync
  if (processorName === 'syncfpn') return processorFpSyncNew
  if (processorName === 'synceff') return processorEffectSync
  return null
}

export type SyncBenchmarkConfiguration = {
  isSync: true
  name: string
  processor: SyncProcessor
  warmup: number
  failureRate: number
  epoch: number
}
export type AsyncBenchmarkConfiguration = {
  isSync: false
  name: string
  processor: AsyncProcessor
  warmup: number
  failureRate: number
  epoch: number
}
export type BenchmarkConfiguration =
  | SyncBenchmarkConfiguration
  | AsyncBenchmarkConfiguration

export function get(processorName: string): BenchmarkConfiguration {
  let syncProcessor = getSyncProcessor(processorName)
  if (syncProcessor !== null) {
    return {
      isSync: true,
      name: processorName,
      processor: syncProcessor,
      warmup: config.warmup,
      epoch: config.epoch,
      failureRate: config.failureRate
    }
  }

  let asyncProcessor = getAsyncProcessor(processorName)
  if (asyncProcessor !== null) {
    return {
      isSync: false,
      name: processorName,
      processor: asyncProcessor,
      warmup: config.warmup,
      epoch: config.epoch,
      failureRate: config.failureRate
    }
  }

  throw new Error('Processor "' + processorName + '" not recognized')
}

export type RunnerResult = {
  ok_counter: number
  ko_counter: number
  total: number
}

export function syncRunner(
  processor: SyncProcessor,
  iterations: number,
  failure_rate: number,
): RunnerResult {
  let baseKey = 0
  let ok_counter = 0
  let ko_counter = 0
  let total = 0.0

  while (ok_counter + ko_counter < iterations) {
    let key = 0
    if (ok_counter > 0 && ko_counter / ok_counter < failure_rate) {
      key = invalidKey(baseKey)
      ko_counter += 1
    } else {
      key = validKey(baseKey)
      ok_counter += 1
    }
    const r = processor(key)
    baseKey += 1
    total += r.success ? r.totalAmount : 0
  }
  return {
    ok_counter,
    ko_counter,
    total
  }
}

export async function asyncRunner(
  processor: AsyncProcessor,
  iterations: number,
  failure_rate: number,
): Promise<RunnerResult> {
  let baseKey = 0
  let ok_counter = 0
  let ko_counter = 0
  let total = 0.0

  while (ok_counter + ko_counter < iterations) {
    let key = 0
    if (ok_counter > 0 && ko_counter / ok_counter < failure_rate) {
      key = invalidKey(baseKey)
      ko_counter += 1
    } else {
      key = validKey(baseKey)
      ok_counter += 1
    }
    const r = await processor(key)
    total += r.success ? r.totalAmount : 0
  }
  return {
    ok_counter,
    ko_counter,
    total
  }
}

export async function benchmark(
  config: BenchmarkConfiguration
): Promise<[number, RunnerResult]> {
  if (config.isSync) {
    syncRunner(
      config.processor,
      config.warmup,
      config.failureRate,
    )
    const start = new Date().getTime()
    let result = syncRunner(
      config.processor,
      config.epoch,
      config.failureRate,
    )
    const end = new Date().getTime()
    return [end - start, result]
  } else {
    await asyncRunner(
      config.processor,
      config.warmup,
      config.failureRate,
    )
    const start = new Date().getTime()
    let result = await asyncRunner(
      config.processor,
      config.epoch,
      config.failureRate,
    )
    const end = new Date().getTime()
    return [end - start, result]
  }
}
