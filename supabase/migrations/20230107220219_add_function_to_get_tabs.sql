set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_chat_messages_tab_ids(user_id uuid)
 RETURNS SETOF uuid
 LANGUAGE sql
AS $function$
SELECT tab_id FROM (
SELECT  DISTINCT ON (tab_id) tab_id, created_at FROM chat_messages where user_id='f14ddd33-bb2e-4525-9b70-9427242f9074'
) as tabs
order by created_at ASC
$function$
;


