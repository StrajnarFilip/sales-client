DROP TABLE IF EXISTS
  prices;

DROP TABLE IF EXISTS
  item_quantities;

DROP TABLE IF EXISTS
  sales;

DROP TABLE IF EXISTS
  items;

DROP FUNCTION
  IF EXISTS latest_price;

DROP FUNCTION
  IF EXISTS new_item;

DROP FUNCTION
  IF EXISTS latest_item_prices;

DROP FUNCTION
  IF EXISTS item_details;

DROP FUNCTION
  IF EXISTS ongoing_sale;

DROP function
  if exists sale_items;

CREATE TABLE
  items (
    id BIGSERIAL primary key,
    name TEXT unique,
    details TEXT,
    description TEXT,
    image_url TEXT,
    time_added TIMESTAMP default NOW()
  );

CREATE TABLE
  prices (
    id BIGSERIAL primary key,
    item bigint references items (id),
    price numeric(16, 4),
    time_added TIMESTAMP default NOW()
  );

CREATE TABLE
  sales (
    id BIGSERIAL primary key,
    user_id uuid,
    time_added TIMESTAMP default NOW(),
    sold boolean default false
  );

CREATE TABLE
  item_quantities (
    id BIGSERIAL primary key,
    quantity numeric(16, 4),
    price numeric(16, 4),
    item bigint references items (id),
    sale bigint references sales (id)
  );

ALTER table
  items ENABLE ROW LEVEL SECURITY;

ALTER table
  prices ENABLE ROW LEVEL SECURITY;

ALTER table
  sales ENABLE ROW LEVEL SECURITY;

ALTER table
  item_quantities ENABLE ROW LEVEL SECURITY;

-- Everyone may view all items
CREATE POLICY
  "Enable read access for all users" ON "public"."items" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

-- Everyone may view all prices
CREATE POLICY
  "Enable read access for all users" ON "public"."prices" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

-- User may only work on data with their own user id.
CREATE POLICY
  "User insert sale with their own ID" ON "public"."sales" AS PERMISSIVE FOR ALL TO authenticated USING (auth.uid () = user_id);

-- User may only work on data with their own user id.
CREATE POLICY
  "User insert sale with their own ID" ON "public"."item_quantities" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (
    auth.uid () = (
      SELECT
        user_id
      FROM
        sales
      WHERE
        item_quantities.sale = sales.id
    )
  );

create policy
  "User selects their own items" ON "public"."item_quantities" AS PERMISSIVE for
select
  to authenticated using (
    auth.uid () = (
      select
        user_id
      from
        sales
        where item_quantities.sale = sales.id
    )
  );

-- This function gets latest price (based on timestamp) of item with item_id.
CREATE
OR REPLACE function latest_price (item_id bigint) returns numeric(16, 4) as $$
  SELECT price FROM prices
  WHERE prices.id =
  (SELECT max(mp.id) FROM
  (SELECT * FROM prices as p WHERE item_id = p.item) as mp);
$$ language sql;

-- This function gets latest prices of all items.
CREATE
OR REPLACE function latest_item_prices () returns TABLE (
  item_id bigint,
  item_name TEXT,
  latest_price numeric(16, 4)
) as $$
select
  items.id, items.name, prices.price
from
  (
    select
      items.id as item_id,
      max(prices.id) as price_id
    from
      items
      inner join prices on prices.item = items.id
    group by
      items.id
  ) as latest_ids
  inner join items on latest_ids.item_id = items.id
  inner join prices on latest_ids.price_id = prices.id;
$$ language sql;

-- This function makes it convenient to add an item and the latest price for it.
CREATE
OR REPLACE function new_item (item_name text, initial_price numeric(16, 4)) returns bigint as $$
  insert into items (name) values (item_name);
  insert into prices (item,price) values ((select id from items where items.name = item_name), initial_price);
  select id from items where items.name = item_name;
$$ language sql;

-- This function will get all information of an item, as well as it's latest price.
create
OR REPLACE function item_details (
  in iid bigint,
  out id bigint,
  out name text,
  out details text,
  out description text,
  out image_url text,
  out time_added timestamp,
  out latest_price numeric(16, 4)
) as $$
select
li.item_id, items.name, items.details,
items.description, items.image_url,
items.time_added, li.latest_price
from latest_item_prices() as li
inner join items on items.id = li.item_id
where items.id = iid;
$$ language sql;

create
OR REPLACE function ongoing_sale (
  in user_uuid uuid,
  out sale_id bigint,
  out user_id uuid,
  out time_added timestamp
) as $$
select sales.id , sales.user_id, sales.time_added from sales
where sales.id = (
  select max(sales.id) from sales
  where sales.user_id = user_uuid and sales.sold = false
);
$$ language sql;

create
OR REPLACE function sale_items (in input_sale_items bigint) returns table (
  item_quantity_id bigint,
  quantity numeric(16, 4),
  name text,
  image_url text,
  details text,
  description text,
  price numeric(16, 4)
) as $$
  SELECT
  iq.id, iq.quantity, items.name,
  items.image_url, items.details,
  items.description, iq.price from item_quantities as iq
  inner join items on items.id = iq.item
  WHERE iq.sale = input_sale_items;
$$ language sql;

select
  *
from
  new_item ('Cheese', 10);

select
  *
from
  new_item ('Tomato', 1.99);

select
  *
from
  new_item ('Potato', 0.69);

select
  *
from
  new_item ('Corn', 4.8);

select
  *
from
  new_item ('Oats', 1.18);
