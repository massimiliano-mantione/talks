use super::api::*;
use super::data::{
    get_book_sync as get_book, get_order_sync as get_order,
    validate_order_checked as validate_order, ValidatedOrder,
};

fn composer<T1: 'static, T2: 'static, E: 'static>(
    input: Result<T1, E>,
    transform: &'static impl Fn(T1) -> Result<T2, E>,
) -> Result<T2, E> {
    input.and_then(transform)
}

fn compose_two<T1: 'static, T2: 'static, T3: 'static, E: 'static>(
    transform1: &'static impl Fn(T1) -> Result<T2, E>,
    transform2: &'static impl Fn(T2) -> Result<T3, E>,
) -> impl Fn(Result<T1, E>) -> Result<T3, E> {
    move |x| composer(composer(x, transform1), transform2)
}

macro_rules! compose {
    ( $last:expr ) => { $last };
    ( $head:expr, $($tail:expr), +) => {
        compose_two($head, compose!($($tail),+))
    };
}

fn book_service(key: usize) -> Result<Book, OrderNotValid> {
    match get_book(key) {
        Some(b) => Ok(b),
        None => Err(OrderNotValid::BookNotExists),
    }
}

fn order_service(key: usize) -> Result<Order, OrderNotValid> {
    Ok(get_order(key))
}

fn validation_service(order: Order) -> ValidationResultChecked {
    validate_order(order)
}

fn calculate_amount_service(order: ValidatedOrder) -> Result<f64, OrderNotValid> {
    order
        .items
        .iter()
        .map(|line| (book_service(line.book_key), line.quantity))
        .fold(Ok(0.0), |current, (order, quantity)| match current {
            Ok(amount) => match order {
                Ok(book) => Ok(amount + quantity as f64 * book.price),
                _ => panic!("book error"),
            },
            _ => panic!("order error"),
        })
}

fn place_order_service(order: ValidatedOrder) -> Result<f64, OrderNotValid> {
    calculate_amount_service(order)
}

pub struct SyncFpCheckedProcessor {}

impl SyncProcessor for SyncFpCheckedProcessor {
    fn process(&self, key: usize) -> ProcessResult {
        compose!(&validation_service, &place_order_service)(order_service(key))
    }
}

impl SyncFpCheckedProcessor {
    pub fn processor() -> &'static dyn SyncProcessor {
        &(SyncFpCheckedProcessor {}) as &dyn SyncProcessor
    }
}

pub fn process_syncfp_checked_direct(key: usize) -> ProcessResult {
    compose!(&validation_service, &place_order_service)(order_service(key))
}
