use super::api::*;
use super::data::{get_book, get_order};
use std::future::{ready, Future};
use std::pin::Pin;

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

fn place_order_service(order: Order) -> Pin<Box<dyn Future<Output = ProcessResult>>> {
    calculate_amount_service(order)
}

pub struct FutureDynProcessor {}

impl AsyncProcessor for FutureDynProcessor {
    fn process(&self, order_id: &'static String) -> AsyncProcessResult {
        Box::pin(async {
            order_service(order_id)
                .await
                .chain(validation_service)
                .await
                .chain(place_order_service)
                .await
        })
    }
}

impl FutureDynProcessor {
    pub fn processor() -> &'static dyn AsyncProcessor {
        &(FutureDynProcessor {}) as &dyn AsyncProcessor
    }
}

pub fn process_future_dyn_direct(order_id: &'static String) -> impl Future<Output = ProcessResult> {
    async {
        order_service(order_id)
            .await
            .chain(validation_service)
            .await
            .chain(place_order_service)
            .await
    }
}
