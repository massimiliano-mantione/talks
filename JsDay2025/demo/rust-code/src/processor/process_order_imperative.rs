use super::api::*;
use super::data::{get_book, get_order};

async fn book_service(id: &String) -> Option<Book> {
    get_book(id)
}

async fn order_service(id: &String) -> Option<Order> {
    get_order(id)
}

async fn validation_service(order: Order) -> Result<Order, OrderNotValid> {
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
    let result = calculate_amount_service(order).await;
    Ok(OrderSuccessful::new(result.0))
}

pub async fn process_imperative_direct(order_id: &String) -> ProcessResult {
    match order_service(order_id).await {
        Some(order) => match validation_service(order).await {
            Ok(order) => match place_order_service(order).await {
                Ok(res) => Ok(res.amount),
                Err(err) => Err(err),
            },
            Err(err) => Err(err),
        },
        None => Err(OrderNotValid::OrderNotExists),
    }
}

pub struct ImperativeProcessor {}

impl AsyncProcessor for ImperativeProcessor {
    fn process(&self, order_id: &'static String) -> AsyncProcessResult {
        Box::pin(process_imperative_direct(order_id))
    }
}

impl ImperativeProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(ImperativeProcessor {}) as &dyn AsyncProcessor
    }
}
