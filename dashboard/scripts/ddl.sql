CREATE TABLE users
(
    ID       TEXT PRIMARY KEY NOT NULL,
    name     TEXT            NOT NULL,
    email    TEXT            NOT NULL,
    password TEXT            NOT NULL
);

CREATE TABLE invoices
(
    id          TEXT PRIMARY KEY NOT NULL,
    customer_id TEXT            NOT NULL,
    amount      INT             NOT NULL,
    status      TEXT            NOT NULL,
    date        TEXT            NOT NULL
);

CREATE TABLE customers
(
    id        TEXT PRIMARY KEY NOT NULL,
    name      TEXT            NOT NULL,
    email     TEXT            NOT NULL,
    image_url TEXT            NOT NULL
);

CREATE TABLE revenue
(
    month   TEXT NOT NULL,
    revenue INT  NOT NULL
);