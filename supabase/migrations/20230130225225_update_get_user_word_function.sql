drop function if exists "public"."get_user_word_count"(user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_word_count(my_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
  new_row bigint;
begin
 return(SELECT COALESCE(SUM(word_count),0) as my_count FROM suggestions WHERE user_id = my_id and created_at >= date_trunc('month', current_date));
end;
$function$
;


