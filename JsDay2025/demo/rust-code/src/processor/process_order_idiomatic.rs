use super::api::*;
use super::data::{get_book, get_order};

async fn book_service(id: &String) -> Option<Book> {
    get_book(id)
}

async fn order_service(id: &String) -> Option<Order> {
    get_order(id)
}

async fn validation_service(order: Option<Order>) -> Result<Order, OrderNotValid> {
    match order {
        Some(o) => validate_order(o),
        None => Err(OrderNotValid::BookNotExists),
    }
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

pub async fn process_idiomatic_direct(order_id: &'static String) -> ProcessResult {
    let order = order_service(order_id).await;
    let validated = validation_service(order).await?;
    let amount = place_order_service(validated).await?.amount;
    Ok(amount)
}

pub struct IdiomaticProcessor {}

impl AsyncProcessor for IdiomaticProcessor {
    fn process(&self, order_id: &'static String) -> AsyncProcessResult {
        Box::pin(process_idiomatic_direct(order_id))
    }
}

impl IdiomaticProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(IdiomaticProcessor {}) as &dyn AsyncProcessor
    }
}
