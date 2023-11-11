drop policy "Allow public read-only access." on "public"."prices";

drop policy "Allow public read-only access." on "public"."products";

alter table "public"."prices" drop constraint "prices_currency_check";

alter table "public"."prices" drop constraint "prices_product_id_fkey";

alter table "public"."prices" drop constraint "prices_pkey";

alter table "public"."products" drop constraint "products_pkey";

drop index if exists "public"."prices_pkey";

drop index if exists "public"."products_pkey";

drop table "public"."prices";

drop table "public"."products";


