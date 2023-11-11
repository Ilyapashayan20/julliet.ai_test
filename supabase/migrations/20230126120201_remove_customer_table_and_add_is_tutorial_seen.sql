alter table "public"."customers" drop constraint "customers_id_fkey";

alter table "public"."customers" drop constraint "customers_pkey";

drop index if exists "public"."customers_pkey";

drop table "public"."customers";

alter table "public"."users" add column "is_tutorial_seen" boolean default false;


