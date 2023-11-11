set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_chat_messages_tab_ids(user_id uuid, search text)
 RETURNS SETOF uuid
 LANGUAGE sql
AS $function$
SELECT tab_id FROM (
  SELECT DISTINCT ON (tab_id) tab_id, created_at
  FROM chat_messages
  WHERE user_id = user_id AND text ILIKE '%' || search || '%'
  ORDER BY tab_id, created_at ASC
) AS tabs
ORDER BY created_at ASC;
$function$
;


