drop policy "Enable insert for authenticated users only" on "public"."documents";

drop policy "Enable read access for all users" on "public"."documents";

alter table "public"."documents" enable row level security;

alter table "public"."subscriptions" enable row level security;

alter table "public"."suggestions" enable row level security;

create policy "documents_all"
on "public"."documents"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "subscriptions_delete"
on "public"."subscriptions"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "subscriptions_insert"
on "public"."subscriptions"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "subscriptions_select"
on "public"."subscriptions"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "subscriptions_update"
on "public"."subscriptions"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "suggestions_all"
on "public"."suggestions"
as permissive
for all
to authenticated
using ((auth.uid() = user_id));



