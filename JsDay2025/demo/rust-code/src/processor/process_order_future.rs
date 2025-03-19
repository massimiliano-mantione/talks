use super::api::*;
use super::data::{get_book, get_order};
use std::future::Future;

async fn book_service(id: &String) -> Option<Book> {
    get_book(id)
}

async fn order_service(id: &String) -> Option<Order> {
    get_order(id)
}

async fn validation_service(order: Order) -> ValidationResult {
    validate_order(order)
}

async fn calculate_amount_service(order: Order) -> (f64, Order) {
    let mut total = 0.0;
    for item in &order.items {
        let book = book_service(&item.book_id).await;
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
    fn process(&self, order_id: &'static String) -> AsyncProcessResult {
        Box::pin(async {
            order_service(order_id)
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

pub fn process_future_direct(order_id: &'static String) -> impl Future<Output = ProcessResult> {
    async {
        order_service(order_id)
            .await
            .ok_or_else(|| OrderNotValid::BookNotExists)
            .chain(validation_service)
            .await
            .chain(place_order_service)
            .await
            .map(|result| result.amount)
    }
}
