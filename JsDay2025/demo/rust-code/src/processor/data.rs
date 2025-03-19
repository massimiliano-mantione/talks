use super::api::*;
use std::str::FromStr;
use std::sync::LazyLock;

#[derive(Clone)]
struct StoredBook {
    #[allow(dead_code)]
    pub name: String,
    #[allow(dead_code)]
    pub author: String,
    pub price: f64,
}

impl StoredBook {
    pub fn new(name: &str, author: &str, price: f64) -> Self {
        Self {
            name: String::from_str(name).unwrap(),
            author: String::from_str(author).unwrap(),
            price,
        }
    }

    pub fn with_key(&self, key: usize) -> Book {
        Book {
            key,
            name: self.name.clone(),
            author: self.author.clone(),
            price: self.price,
        }
    }
}

struct StoredOrder {
    #[allow(dead_code)]
    pub date: chrono::NaiveDateTime,
    pub items: Vec<OrderLine>,
}

impl StoredOrder {
    pub fn new(year: i32, month: u32, day: u32, items: &[OrderLine]) -> Self {
        Self {
            date: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(year, month, day).unwrap(),
                chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
            ),
            items: items.to_vec(),
        }
    }

    pub fn with_key(&self, key: usize) -> Order {
        Order {
            key,
            date: self.date,
            items: self.items.clone(),
        }
    }
}

static BOOKS: LazyLock<[StoredBook; 3]> = LazyLock::new(|| {
    [
        StoredBook::new("Positioning: The Battle for Your Mind", "Al Reis", 12.98),
        StoredBook::new(
            "Start With Why: How Great Leaders Inspire Everyone to Take Action",
            "Simon Sinek",
            11.51,
        ),
        StoredBook::new(
            "Pitch Anything: An Innovative Method for Presenting, Persuading, and Winning the Deal",
            "Oren Klaff",
            19.23,
        ),
    ]
});

pub fn get_book_sync(key: usize) -> Option<Book> {
    BOOKS.get(key - 1).map(|b| b.with_key(key))
}

pub async fn get_book_async(key: usize) -> Option<Book> {
    get_book_sync(key)
}

const VALID_ORDERS_COUNT: usize = 3;
static VALID_ORDERS: LazyLock<[StoredOrder; VALID_ORDERS_COUNT]> = LazyLock::new(|| {
    [
        StoredOrder::new(2019, 1, 2, &[OrderLine::new(1, 10), OrderLine::new(3, 27)]),
        StoredOrder::new(2019, 1, 3, &[OrderLine::new(2, 7), OrderLine::new(3, 5)]),
        StoredOrder::new(
            2019,
            1,
            4,
            &[
                OrderLine::new(3, 11),
                OrderLine::new(1, 23),
                OrderLine::new(2, 2),
            ],
        ),
    ]
});

const INVALID_ORDERS_COUNT: usize = 2;
static INVALID_ORDERS: LazyLock<[StoredOrder; 2]> = LazyLock::new(|| {
    [
        StoredOrder::new(2019, 1, 1, &[]),
        StoredOrder::new(2019, 1, 5, &[OrderLine::new(4, 3)]),
    ]
});

pub fn validate_order_sync(order: Order) -> ValidationResult {
    if order.items.len() == 0 {
        return Err(OrderNotValid::NoItems);
    }
    for item in &order.items {
        if get_book_sync(item.book_key).is_none() {
            return Err(OrderNotValid::BookNotExists);
        }
    }
    Ok(order)
}

pub async fn validate_order_async(order: Order) -> ValidationResult {
    if order.items.len() == 0 {
        return Err(OrderNotValid::NoItems);
    }
    for item in &order.items {
        if get_book_async(item.book_key).await.is_none() {
            return Err(OrderNotValid::BookNotExists);
        }
    }
    Ok(order)
}

pub fn check_orders_data() -> bool {
    for order in VALID_ORDERS.iter() {
        if validate_order_sync(order.with_key(0)).is_err() {
            return false;
        }
    }

    for order in INVALID_ORDERS.iter() {
        if validate_order_sync(order.with_key(0)).is_ok() {
            return false;
        }
    }

    return true;
}

pub fn valid_key(base_key: usize) -> usize {
    base_key * 2
}

pub fn invalid_key(base_key: usize) -> usize {
    (base_key * 2) + 1
}

fn get_order(key: usize) -> Order {
    let index = key / 2;
    if key % 2 == 0 {
        return VALID_ORDERS[index % VALID_ORDERS_COUNT].with_key(key);
    } else {
        return INVALID_ORDERS[index % INVALID_ORDERS_COUNT].with_key(key);
    }
}

pub fn get_order_sync(key: usize) -> Order {
    get_order(key)
}

pub async fn get_order_async(key: usize) -> Order {
    get_order(key)
}
