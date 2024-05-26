create table cart
(
    id          INTEGER
        primary key autoincrement,
    customer    TEXT    not null,
    paid        BOOLEAN not null,
    paymentDate TEXT,
    total       REAL    not null
);

create table product
(
    sellingPrice REAL    not null,
    model        TEXT    not null
        primary key,
    category     text,
    arrivalDate  TEXT,
    details      TEXT,
    quantity     INTEGER not null
);

create table cart_product
(
    id       INTEGER
        primary key autoincrement,
    cartId   INTEGER not null
        references cart
            on update cascade on delete cascade,
    model    TEXT    not null
        references product
            on update cascade on delete cascade,
    quantity INTEGER not null
);

create table review
(
    id      INTEGER
        primary key autoincrement,
    model   TEXT    not null
        references product
            on update cascade on delete cascade,
    user    TEXT    not null,
    score   INTEGER not null,
    date    TEXT    not null,
    comment TEXT
);

-- create table users
-- (
--     username  TEXT not null
--         primary key
--         unique,
--     name      TEXT not null,
--     surname   TEXT not null,
--     role      TEXT not null,
--     password  TEXT,
--     salt      TEXT,
--     address   TEXT,
--     birthdate TEXT
-- );

