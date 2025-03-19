use super::api::*;
use super::data::{
    get_book_sync as get_book, get_order_sync as get_order, validate_order_sync as validate_order,
};

fn book_service(key: usize) -> Option<Book> {
    get_book(key)
}

fn order_service(key: usize) -> Option<Order> {
    Some(get_order(key))
}

fn validation_service(order: Order) -> Result<Order, OrderNotValid> {
    validate_order(order)
}

fn calculate_amount_service(order: Order) -> f64 {
    let mut total = 0.0;
    for item in &order.items {
        let book = book_service(item.book_key);
        match book {
            Some(b) => {
                total += item.quantity as f64 * b.price;
            }
            _ => {}
        };
    }
    total
}

fn place_order_service(order: Order) -> PlacedOrderResult {
    let amount = calculate_amount_service(order);
    Ok(OrderSuccessful::new(amount))
}

pub struct ImperativeProcessorSync {}

impl SyncProcessor for ImperativeProcessorSync {
    fn process(&self, key: usize) -> ProcessResult {
        match order_service(key) {
            Some(order) => {
                let validation = validation_service(order);
                match validation {
                    Ok(order) => match place_order_service(order) {
                        Ok(res) => Ok(res.amount),
                        Err(err) => Err(err),
                    },
                    Err(err) => Err(err),
                }
            }
            None => Err(OrderNotValid::OrderNotExists),
        }
    }
}

impl ImperativeProcessorSync {
    pub fn processor() -> &'static dyn SyncProcessor {
        &(ImperativeProcessorSync {}) as &dyn SyncProcessor
    }
}

pub fn process_sync_direct(key: usize) -> ProcessResult {
    match order_service(key) {
        Some(order) => {
            let validation = validation_service(order);
            match validation {
                Ok(order) => match place_order_service(order) {
                    Ok(res) => Ok(res.amount),
                    Err(err) => Err(err),
                },
                Err(err) => Err(err),
            }
        }
        None => Err(OrderNotValid::OrderNotExists),
    }
}
