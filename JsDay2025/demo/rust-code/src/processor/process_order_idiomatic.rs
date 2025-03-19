use super::api::*;
use super::data::{
    get_book_async as get_book, get_order_async as get_order,
    validate_order_async as validate_order,
};

async fn book_service(key: usize) -> Option<Book> {
    get_book(key).await
}

async fn order_service(key: usize) -> Option<Order> {
    Some(get_order(key).await)
}

async fn validation_service(order: Option<Order>) -> Result<Order, OrderNotValid> {
    match order {
        Some(o) => validate_order(o).await,
        None => Err(OrderNotValid::BookNotExists),
    }
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

pub async fn process_idiomatic_direct(key: usize) -> ProcessResult {
    let order = order_service(key).await;
    let validated = validation_service(order).await?;
    let amount = place_order_service(validated).await?.amount;
    Ok(amount)
}

pub struct IdiomaticProcessor {}

impl AsyncProcessor for IdiomaticProcessor {
    fn process(&self, key: usize) -> AsyncProcessResult {
        Box::pin(process_idiomatic_direct(key))
    }
}

impl IdiomaticProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(IdiomaticProcessor {}) as &dyn AsyncProcessor
    }
}
