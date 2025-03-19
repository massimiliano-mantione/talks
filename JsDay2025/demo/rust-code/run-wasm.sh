cargo build --release --target wasm32-wasip2
wasmtime target/wasm32-wasip2/release/rust-code.wasm
