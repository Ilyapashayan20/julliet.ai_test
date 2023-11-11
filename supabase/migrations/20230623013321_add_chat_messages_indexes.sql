CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at);

CREATE INDEX idx_chat_messages_user_id ON public.chat_messages USING btree (user_id);


