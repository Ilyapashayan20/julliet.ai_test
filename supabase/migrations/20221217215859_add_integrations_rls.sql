alter table "public"."integrations" enable row level security;

create policy "integrations_delete"
on "public"."integrations"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "integrations_insert"
on "public"."integrations"
as permissive
for insert
to authenticated
with check (true);


create policy "integrations_select"
on "public"."integrations"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "integrations_update"
on "public"."integrations"
as permissive
for update
to public
using ((auth.uid() = user_id));



