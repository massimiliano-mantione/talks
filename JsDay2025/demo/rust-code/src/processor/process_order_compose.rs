use super::api::*;
use super::data::{
    get_book_async as get_book, get_order_async as get_order,
    validate_order_async as validate_order,
};
use std::future::{ready, Future};

macro_rules! compose {
    ( $last:expr ) => { $last };
    ( $head:expr, $($tail:expr), +) => {
        compose_two($head, compose!($($tail),+))
    };
}

pub fn compose_two<A, B, C, G, F>(f: F, g: G) -> impl Fn(A) -> C
where
    F: Fn(A) -> B,
    G: Fn(B) -> C,
{
    move |x| g(f(x))
}

async fn book_service(key: usize) -> Option<Book> {
    get_book(key).await
}

async fn order_service(key: usize) -> Option<Order> {
    Some(get_order(key).await)
}

async fn validation_service(
    order: impl Future<Output = Option<Order>>,
) -> Result<Order, OrderNotValid> {
    let order = order.await;
    match order {
        Some(order) => validate_order(order).await,
        None => Err(OrderNotValid::BookNotExists),
    }
}

async fn calculate_amount_service(
    order: impl Future<Output = Order>,
) -> Result<f64, OrderNotValid> {
    let order = order.await;
    let mut total = 0.0;
    for item in &order.items {
        let book = book_service(item.book_key).await;
        match book {
            Some(b) => {
                total += item.quantity as f64 * b.price;
            }
            _ => {}
        };
    }
    Ok(total)
}

async fn place_order_service(
    order: impl Future<Output = Result<Order, OrderNotValid>>,
) -> Result<f64, OrderNotValid> {
    order
        .await
        .map(|o| ready(o))
        .chain(calculate_amount_service)
        .await
}

pub struct ComposeProcessor {}

impl AsyncProcessor for ComposeProcessor {
    fn process(&self, key: usize) -> AsyncProcessResult {
        Box::pin(compose!(
            order_service,
            validation_service,
            place_order_service
        )(key))
    }
}

impl ComposeProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(ComposeProcessor {}) as &dyn AsyncProcessor
    }
}

pub fn process_compose_direct(key: usize) -> impl Future<Output = ProcessResult> {
    compose!(order_service, validation_service, place_order_service)(key)
}
