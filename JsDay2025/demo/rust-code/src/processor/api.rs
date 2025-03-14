use super::data::BOOKS;
use std::future::Future;
use std::pin::Pin;
use std::str::FromStr;

#[derive(Clone)]
pub struct Book {
    #[allow(dead_code)]
    pub name: String,
    #[allow(dead_code)]
    pub author: String,
    pub price: f64,
}

impl Book {
    pub fn new(name: &str, author: &str, price: f64) -> Book {
        Book {
            name: String::from_str(name).unwrap(),
            author: String::from_str(author).unwrap(),
            price,
        }
    }
}

#[derive(Clone)]
pub struct OrderLine {
    pub book_id: String,
    pub quantity: i32,
}

impl OrderLine {
    pub fn new(book_id: &str, quantity: i32) -> OrderLine {
        OrderLine {
            book_id: String::from_str(book_id).unwrap(),
            quantity,
        }
    }
}

#[derive(Clone)]
pub struct Order {
    #[allow(dead_code)]
    pub date: chrono::NaiveDateTime,
    pub items: Vec<OrderLine>,
}

impl Order {
    pub fn new(year: i32, month: u32, day: u32, items: &[OrderLine]) -> Order {
        Order {
            date: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(year, month, day).unwrap(),
                chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
            ),
            items: items.to_vec(),
        }
    }
}

pub enum OrderNotValid {
    NoItems,
    BookNotExists,
    OrderNotExists,
}

pub type ValidationResult = Result<Order, OrderNotValid>;

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
    fn process(&self, order_id: &String) -> ProcessResult;
}

pub type AsyncProcessResult = Pin<Box<dyn Future<Output = Result<f64, OrderNotValid>>>>;
pub trait AsyncProcessor {
    fn process(&self, order_id: &'static String) -> AsyncProcessResult;
}

pub fn validate_order(order: Order) -> ValidationResult {
    if order.items.len() == 0 {
        return Err(OrderNotValid::NoItems);
    }
    for item in &order.items {
        if !BOOKS.contains_key(&item.book_id) {
            return Err(OrderNotValid::BookNotExists);
        }
    }
    Ok(order)
}

pub trait ExtResultFuture<IN, ERR> {
    #[allow(dead_code)]
    async fn map_async<OUT>(self, f: impl AsyncFnOnce(IN) -> OUT) -> Result<OUT, ERR>;
    async fn and_then_async<OUT>(
        self,
        f: impl AsyncFnOnce(IN) -> Result<OUT, ERR>,
    ) -> Result<OUT, ERR>;
}

impl<IN, ERR> ExtResultFuture<IN, ERR> for Result<IN, ERR> {
    async fn map_async<OUT>(self, f: impl AsyncFnOnce(IN) -> OUT) -> Result<OUT, ERR> {
        match self {
            Ok(value) => Ok(f(value).await),
            Err(err) => Err(err),
        }
    }

    async fn and_then_async<OUT>(
        self,
        f: impl AsyncFnOnce(IN) -> Result<OUT, ERR>,
    ) -> Result<OUT, ERR> {
        match self {
            Ok(value) => f(value).await,
            Err(err) => Err(err),
        }
    }
}
