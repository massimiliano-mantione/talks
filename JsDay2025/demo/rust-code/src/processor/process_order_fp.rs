use super::api::*;
use super::data::{get_book, get_order};
use std::future::{ready, Future};
use std::pin::Pin;

fn apply_transform<T1: 'static, T2: 'static, E: 'static>(
    input: Pin<Box<dyn Future<Output = Result<T1, E>>>>,
    transform: &'static impl AsyncFn(T1) -> Result<T2, E>,
) -> Pin<Box<dyn Future<Output = Result<T2, E>>>> {
    Box::pin(async move {
        let input = input.await;
        match input {
            Ok(value) => transform(value).await,
            Err(e) => Err(e),
        }
    })
}

fn compose_two<T1: 'static, T2: 'static, T3: 'static, E: 'static>(
    transform1: &'static impl AsyncFn(T1) -> Result<T2, E>,
    transform2: &'static impl AsyncFn(T2) -> Result<T3, E>,
) -> impl Fn(Pin<Box<dyn Future<Output = Result<T1, E>>>>) -> Pin<Box<dyn Future<Output = Result<T3, E>>>>
{
    move |x| apply_transform(apply_transform(x, transform1), transform2)
}

macro_rules! compose {
    ( $last:expr ) => { $last };
    ( $head:expr, $($tail:expr), +) => {
        compose_two($head, compose!($($tail),+))
    };
}

fn book_service(id: &String) -> Pin<Box<dyn Future<Output = Result<Book, OrderNotValid>>>> {
    Box::pin(ready(match get_book(id) {
        Some(b) => Ok(b),
        None => Err(OrderNotValid::BookNotExists),
    }))
}

fn order_service(id: &String) -> Pin<Box<dyn Future<Output = Result<Order, OrderNotValid>>>> {
    Box::pin(ready(match get_order(id) {
        Some(b) => Ok(b),
        None => Err(OrderNotValid::BookNotExists),
    }))
}

fn validation_service(order: Order) -> Pin<Box<dyn Future<Output = Result<Order, OrderNotValid>>>> {
    Box::pin(ready(validate_order(order)))
}

fn calculate_amount_service(
    order: Order,
) -> Pin<Box<dyn Future<Output = Result<f64, OrderNotValid>>>> {
    Box::pin(async move {
        let mut total = 0.0;
        for item in &order.items {
            let book = book_service(&item.book_id).await;
            match book {
                Ok(b) => {
                    total += item.quantity as f64 * b.price;
                }
                _ => {}
            };
        }
        Ok(total)
    })
}

fn place_order_service(order: Order) -> Pin<Box<dyn Future<Output = Result<f64, OrderNotValid>>>> {
    calculate_amount_service(order)
}

pub struct FpProcessor {}

impl AsyncProcessor for FpProcessor {
    fn process(&self, order_id: &'static String) -> AsyncProcessResult {
        Box::pin(compose!(&validation_service, &place_order_service)(
            order_service(order_id),
        ))
    }
}

impl FpProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(FpProcessor {}) as &dyn AsyncProcessor
    }
}

pub fn process_fp_direct(order_id: &'static String) -> impl Future<Output = ProcessResult> {
    compose!(&validation_service, &place_order_service)(order_service(order_id))
}
