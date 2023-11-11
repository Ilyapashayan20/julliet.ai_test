set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_word_count(user_id uuid)
 RETURNS integer
 LANGUAGE sql
AS $function$
SELECT SUM(word_count) FROM suggestions WHERE user_id = user_id and created_at >= date_trunc('month', current_date);
$function$
;


