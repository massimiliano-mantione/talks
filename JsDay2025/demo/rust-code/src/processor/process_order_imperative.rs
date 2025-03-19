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

async fn validation_service(order: Order) -> Result<Order, OrderNotValid> {
    validate_order(order).await
}

async fn calculate_amount_service(order: Order) -> f64 {
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
    total
}

async fn place_order_service(order: Order) -> PlacedOrderResult {
    let amount = calculate_amount_service(order).await;
    Ok(OrderSuccessful::new(amount))
}

pub struct ImperativeProcessorAsync {}

impl AsyncProcessor for ImperativeProcessorAsync {
    fn process(&self, key: usize) -> AsyncProcessResult {
        Box::pin(async move {
            match order_service(key).await {
                Some(order) => {
                    let validation = validation_service(order).await;
                    match validation {
                        Ok(order) => match place_order_service(order).await {
                            Ok(res) => Ok(res.amount),
                            Err(err) => Err(err),
                        },
                        Err(err) => Err(err),
                    }
                }
                None => Err(OrderNotValid::OrderNotExists),
            }
        })
    }
}

impl ImperativeProcessorAsync {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(ImperativeProcessorAsync {}) as &dyn AsyncProcessor
    }
}

pub async fn process_async_direct(key: usize) -> ProcessResult {
    match order_service(key).await {
        Some(order) => {
            let validation = validation_service(order).await;
            match validation {
                Ok(order) => match place_order_service(order).await {
                    Ok(res) => Ok(res.amount),
                    Err(err) => Err(err),
                },
                Err(err) => Err(err),
            }
        }
        None => Err(OrderNotValid::OrderNotExists),
    }
}
