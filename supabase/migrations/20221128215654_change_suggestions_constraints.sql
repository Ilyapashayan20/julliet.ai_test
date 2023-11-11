alter table "public"."suggestions" drop constraint "suggestions_document_id_fkey";

alter table "public"."suggestions" alter column "document_id" drop not null;

alter table "public"."suggestions" add constraint "suggestions_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL not valid;

alter table "public"."suggestions" validate constraint "suggestions_document_id_fkey";


