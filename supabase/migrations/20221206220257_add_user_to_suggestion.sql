alter table "public"."documents" disable row level security;

alter table "public"."suggestions" add column "user_id" uuid;

alter table "public"."suggestions" add constraint "suggestions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."suggestions" validate constraint "suggestions_user_id_fkey";


