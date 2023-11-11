create table "public"."images" (
    "id" uuid not null default uuid_generate_v1(),
    "image_url" text not null,
    "prompt" text not null,
    "model" text,
    "nsfw" boolean,
    "width" integer,
    "height" integer,
    "guidance" smallint,
    "lexica_id" uuid,
    "created_at" timestamp with time zone default now(),
    "seed" bigint
);


alter table "public"."images" enable row level security;

alter table "public"."chat_messages" add column "tab_id" uuid;

CREATE UNIQUE INDEX images_pkey ON public.images USING btree (id);

CREATE INDEX index_chat_tab_id ON public.chat_messages USING btree (tab_id);

alter table "public"."images" add constraint "images_pkey" PRIMARY KEY using index "images_pkey";


