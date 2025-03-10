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
import { categorizedOrderIds } from './data.ts'
import { SyncProcessor, AsyncProcessor } from './api.ts'

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
  return null
}

export type BenchmarkIds = { ok: string[]; ko: string[] }

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
  ids: BenchmarkIds
): RunnerResult {
  let ok_counter = 0
  let ko_counter = 0
  let total = 0.0

  while (ok_counter + ko_counter < iterations) {
    let id = ''
    if (ok_counter > 0 && ko_counter / ok_counter < failure_rate) {
      id = ids.ko[ko_counter % ids.ko.length]
      ko_counter += 1
    } else {
      id = ids.ok[ok_counter % ids.ok.length]
      ok_counter += 1
    }
    const r = processor(id)
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
  ids: BenchmarkIds
): Promise<RunnerResult> {
  let ok_counter = 0
  let ko_counter = 0
  let total = 0.0

  while (ok_counter + ko_counter < iterations) {
    let id = ''
    if (ok_counter > 0 && ko_counter / ok_counter < failure_rate) {
      id = ids.ko[ko_counter % ids.ko.length]
      ko_counter += 1
    } else {
      id = ids.ok[ok_counter % ids.ok.length]
      ok_counter += 1
    }
    const r = await processor(id)
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
      categorizedOrderIds
    )
    const start = new Date().getTime()
    let result = syncRunner(
      config.processor,
      config.epoch,
      config.failureRate,
      categorizedOrderIds
    )
    const end = new Date().getTime()
    return [end - start, result]
  } else {
    await asyncRunner(
      config.processor,
      config.warmup,
      config.failureRate,
      categorizedOrderIds
    )
    const start = new Date().getTime()
    let result = await asyncRunner(
      config.processor,
      config.epoch,
      config.failureRate,
      categorizedOrderIds
    )
    const end = new Date().getTime()
    return [end - start, result]
  }
}
