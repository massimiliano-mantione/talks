use configuration::{
    benchmark, benchmark_direct, AsyncProcessorKind, ProcessorKind, RunnerResult, SyncProcessorKind,
};
use wasi_async_runtime::block_on;

mod api;
mod configuration;
mod data;
mod process_order_compose;
mod process_order_fp;
mod process_order_fp_checked;
mod process_order_future;
mod process_order_futuredyn;
mod process_order_idiomatic;
mod process_order_imperative;
mod process_order_imperative_sync;
mod process_order_syncfp;
mod process_order_syncfp_checked;

pub use data::check_orders_data;

fn report(
    kind: ProcessorKind,
    direct: bool,
    time_as_ms: f64,
    runner_result: RunnerResult,
    print: &impl Fn(&str) -> (),
) {
    let iterations = runner_result.ok_counter + runner_result.ko_counter;
    let iter_as_us = (1000.0 * time_as_ms) / (iterations as f64);
    print(&format!(
        "{}\t{}\ttime ms {}\t iter us {}\titer {}\t(ok {} ko {})\ttotal {}",
        if direct { "dir" } else { "dyn" },
        kind.name(),
        time_as_ms,
        iter_as_us,
        iterations,
        runner_result.ok_counter,
        runner_result.ko_counter,
        runner_result.total
    ));
}

struct BenchmarkResult {
    pub kind: ProcessorKind,
    pub dynamic_usec: f64,
    pub dynamic_millis: f64,
    pub direct_usec: f64,
    pub direct_millis: f64,
}

impl BenchmarkResult {
    pub fn new(kind: ProcessorKind) -> Self {
        BenchmarkResult {
            kind,
            dynamic_usec: 1000000.0,
            dynamic_millis: 1000000.0,
            direct_usec: 1000000.0,
            direct_millis: 1000000.0,
        }
    }

    pub fn update(
        &mut self,
        time_as_millis: f64,
        result: &configuration::RunnerResult,
        direct: bool,
    ) {
        let iterations = result.ok_counter + result.ko_counter;
        let iter_as_us = (1000.0 * time_as_millis) / (iterations as f64);
        if direct {
            if time_as_millis < self.direct_millis {
                self.direct_millis = time_as_millis;
                self.direct_usec = iter_as_us;
            }
        } else {
            if time_as_millis < self.dynamic_millis {
                self.dynamic_millis = time_as_millis;
                self.dynamic_usec = iter_as_us;
            }
        }
    }

    pub fn report_direct(&self, print: &impl Fn(&str)) {
        print(&format!(
            "{}\t{}\t{}",
            self.kind.name(),
            self.direct_usec,
            self.direct_millis,
        ));
    }

    pub fn report_dynamic(&self, print: &impl Fn(&str)) {
        print(&format!(
            "{}\t{}\t{}",
            self.kind.name(),
            self.dynamic_usec,
            self.dynamic_millis,
        ));
    }
}

async fn run_benchmerk(
    cumulative_result: &mut BenchmarkResult,
    print: &impl Fn(&str),
    timestamp: &impl Fn() -> f64,
) {
    let kind = cumulative_result.kind;
    let (time_as_millis, result) = benchmark(kind, timestamp).await;
    cumulative_result.update(time_as_millis, &result, false);
    report(kind, false, time_as_millis, result, print);
    let (time_as_millis, result) = benchmark_direct(kind, timestamp).await;
    cumulative_result.update(time_as_millis, &result, true);
    report(kind, true, time_as_millis, result, print);
}

async fn main_async(print: &impl Fn(&str), timestamp: &impl Fn() -> f64) -> () {
    let mut cumulative_results = [
        BenchmarkResult::new(ProcessorKind::SyncKind(SyncProcessorKind::Imperative)),
        BenchmarkResult::new(ProcessorKind::SyncKind(SyncProcessorKind::Fp)),
        BenchmarkResult::new(ProcessorKind::SyncKind(SyncProcessorKind::FpChecked)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::Compose)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::Imperative)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::Idiomatic)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::Future)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::FutureDyn)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::Fp)),
        BenchmarkResult::new(ProcessorKind::AsyncKind(AsyncProcessorKind::FpChecked)),
    ];

    for n in 1..5 {
        for r in cumulative_results.iter_mut() {
            run_benchmerk(r, print, timestamp).await;
        }
        print(&format!(" --- Iteration {}", n));
        print(" - Dynamic");
        for r in cumulative_results.iter() {
            r.report_dynamic(print);
        }
        print(" - Direct");
        for r in cumulative_results.iter() {
            r.report_direct(print);
        }
    }
}

pub fn run(print: &impl Fn(&str), timestamp: &impl Fn() -> f64) {
    block_on(|_| main_async(print, timestamp))
}
