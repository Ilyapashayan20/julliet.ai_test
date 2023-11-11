drop policy "subscriptions_delete" on "public"."subscriptions";

drop policy "subscriptions_insert" on "public"."subscriptions";

drop policy "subscriptions_select" on "public"."subscriptions";

drop policy "subscriptions_update" on "public"."subscriptions";

alter table "public"."subscriptions" disable row level security;


