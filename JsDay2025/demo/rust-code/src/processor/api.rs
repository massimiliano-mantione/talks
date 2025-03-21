use std::future::Future;
use std::pin::Pin;

use super::data::ValidatedOrder;

#[derive(Clone)]
pub struct Book {
    #[allow(dead_code)]
    pub key: usize,
    #[allow(dead_code)]
    pub name: String,
    #[allow(dead_code)]
    pub author: String,
    pub price: f64,
}

#[derive(Clone)]
pub struct OrderLine {
    pub book_key: usize,
    pub quantity: i32,
}

impl OrderLine {
    pub fn new(book_key: usize, quantity: i32) -> OrderLine {
        OrderLine { book_key, quantity }
    }
}

#[derive(Clone)]
pub struct Order {
    #[allow(dead_code)]
    pub key: usize,
    #[allow(dead_code)]
    pub date: chrono::NaiveDateTime,
    pub items: Vec<OrderLine>,
}

pub enum OrderNotValid {
    NoItems,
    BookNotExists,
    OrderNotExists,
}

pub type ValidationResult = Result<Order, OrderNotValid>;
pub type ValidationResultChecked = Result<ValidatedOrder, OrderNotValid>;

#[derive(Clone, Copy)]
pub struct OrderSuccessful {
    pub amount: f64,
}
impl OrderSuccessful {
    pub fn new(amount: f64) -> OrderSuccessful {
        OrderSuccessful { amount }
    }
}

pub type PlacedOrderResult = Result<OrderSuccessful, OrderNotValid>;

pub type ProcessResult = Result<f64, OrderNotValid>;
pub trait SyncProcessor {
    fn process(&self, key: usize) -> ProcessResult;
}

pub type AsyncProcessResult = Pin<Box<dyn Future<Output = Result<f64, OrderNotValid>>>>;
pub trait AsyncProcessor {
    fn process(&self, key: usize) -> AsyncProcessResult;
}

pub trait ExtResultFuture<IN, ERR> {
    #[allow(dead_code)]
    async fn map<OUT>(self, f: impl AsyncFnOnce(IN) -> OUT) -> Result<OUT, ERR>;
    async fn chain<OUT>(self, f: impl AsyncFnOnce(IN) -> Result<OUT, ERR>) -> Result<OUT, ERR>;
}

impl<IN, ERR> ExtResultFuture<IN, ERR> for Result<IN, ERR> {
    async fn map<OUT>(self, f: impl AsyncFnOnce(IN) -> OUT) -> Result<OUT, ERR> {
        match self {
            Ok(value) => Ok(f(value).await),
            Err(err) => Err(err),
        }
    }

    async fn chain<OUT>(self, f: impl AsyncFnOnce(IN) -> Result<OUT, ERR>) -> Result<OUT, ERR> {
        match self {
            Ok(value) => f(value).await,
            Err(err) => Err(err),
        }
    }
}
