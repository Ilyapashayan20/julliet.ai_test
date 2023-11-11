CREATE OR REPLACE FUNCTION public.getuserwordcount(userid uuid)
 RETURNS integer
 LANGUAGE sql
AS $function$
    SELECT SUM(word_count) FROM suggestions WHERE user_id = userId;
$function$
;
