CREATE INDEX idx_chat_messages_search ON public.chat_messages USING btree (user_id, text);


