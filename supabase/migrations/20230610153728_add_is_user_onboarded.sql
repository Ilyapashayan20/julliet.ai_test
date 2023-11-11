alter table "public"."users" add column "is_onboarded" boolean default false;

-- Update the user's is_onboarded column to true for all existing users
update "public"."users" set "is_onboarded" = true;
