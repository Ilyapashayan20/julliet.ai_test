alter table "public"."subscriptions" add column "user_id" uuid;

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";


