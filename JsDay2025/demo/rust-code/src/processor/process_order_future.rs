use super::api::*;
use super::data::{
    get_book_async as get_book, get_order_async as get_order,
    validate_order_async as validate_order,
};
use std::future::Future;

async fn book_service(key: usize) -> Option<Book> {
    get_book(key).await
}

async fn order_service(key: usize) -> Option<Order> {
    Some(get_order(key).await)
}

async fn validation_service(order: Order) -> ValidationResult {
    validate_order(order).await
}

async fn calculate_amount_service(order: Order) -> (f64, Order) {
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
    (total, order)
}

async fn place_order_service(order: Order) -> PlacedOrderResult {
    Ok(OrderSuccessful::new(
        calculate_amount_service(order).await.0,
    ))
}

pub struct FutureProcessor {}

impl AsyncProcessor for FutureProcessor {
    fn process(&self, key: usize) -> AsyncProcessResult {
        Box::pin(async move {
            order_service(key)
                .await
                .ok_or_else(|| OrderNotValid::BookNotExists)
                .chain(validation_service)
                .await
                .chain(place_order_service)
                .await
                .map(|result| result.amount)
        })
    }
}

impl FutureProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(FutureProcessor {}) as &dyn AsyncProcessor
    }
}

pub fn process_future_direct(key: usize) -> impl Future<Output = ProcessResult> {
    async move {
        order_service(key)
            .await
            .ok_or_else(|| OrderNotValid::BookNotExists)
            .chain(validation_service)
            .await
            .chain(place_order_service)
            .await
            .map(|result| result.amount)
    }
}
