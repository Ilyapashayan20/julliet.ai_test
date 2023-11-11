create table "public"."chat_messages" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "text" text not null,
    "is_bot" boolean not null,
    "suggestion_id" bigint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."chat_messages" enable row level security;

CREATE UNIQUE INDEX chat_message_pkey ON public.chat_messages USING btree (id);

alter table "public"."chat_messages" add constraint "chat_message_pkey" PRIMARY KEY using index "chat_message_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_suggestion_id_fkey" FOREIGN KEY (suggestion_id) REFERENCES suggestions(id) not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_suggestion_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_user_id_fkey";

create policy "chat_message_delete"
on "public"."chat_messages"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "chat_message_insert"
on "public"."chat_messages"
as permissive
for insert
to authenticated
with check (true);


create policy "chat_message_select"
on "public"."chat_messages"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "chat_message_update"
on "public"."chat_messages"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));



