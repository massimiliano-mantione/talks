use super::api::*;
use super::configuration::BenchmarkIds;
use std::collections::HashMap;
use std::str::FromStr;
use std::sync::LazyLock;

fn s(text: &str) -> String {
    String::from_str(text).unwrap()
}

fn categorize_ids() -> BenchmarkIds {
    let mut ids = BenchmarkIds {
        ok: vec![],
        ko: vec![],
    };

    for id in ORDERS.keys() {
        match get_order(id) {
            Some(order) => match validate_order(order) {
                Ok(_) => ids.ok.push(id.clone()),
                Err(_) => ids.ko.push(id.clone()),
            },
            None => ids.ko.push(id.clone()),
        }
    }

    ids
}

pub static BOOKS: LazyLock<HashMap<String, Book>> = LazyLock::new(|| {
    let mut m = HashMap::new();
    m.insert(
        s("1"),
        Book::new("Positioning: The Battle for Your Mind", "Al Reis", 12.98),
    );
    m.insert(
        s("2"),
        Book::new(
            "Start With Why: How Great Leaders Inspire Everyone to Take Action",
            "Simon Sinek",
            11.51,
        ),
    );
    m.insert(
        s("3"),
        Book::new(
            "Pitch Anything: An Innovative Method for Presenting, Persuading, and Winning the Deal",
            "Oren Klaff",
            19.23,
        ),
    );
    m
});
pub static ORDERS: LazyLock<HashMap<String, Order>> = LazyLock::new(|| {
    let mut m = HashMap::new();
    m.insert(s("1"), Order::new(2019, 1, 1, &[]));
    m.insert(
        s("2"),
        Order::new(
            2019,
            1,
            2,
            &[OrderLine::new("1", 10), OrderLine::new("3", 27)],
        ),
    );
    m.insert(
        s("3"),
        Order::new(
            2019,
            1,
            3,
            &[OrderLine::new("2", 7), OrderLine::new("3", 5)],
        ),
    );
    m.insert(
        s("4"),
        Order::new(
            2019,
            1,
            4,
            &[
                OrderLine::new("3", 11),
                OrderLine::new("1", 23),
                OrderLine::new("2", 2),
            ],
        ),
    );
    m.insert(s("5"), Order::new(2019, 1, 5, &[OrderLine::new("4", 3)]));
    m
});
pub static BENCHMARK_IDS: LazyLock<BenchmarkIds> = LazyLock::new(|| categorize_ids());

pub fn get_book(id: &String) -> Option<Book> {
    BOOKS.get(id).cloned()
}

pub fn get_order(id: &String) -> Option<Order> {
    ORDERS.get(id).cloned()
}
