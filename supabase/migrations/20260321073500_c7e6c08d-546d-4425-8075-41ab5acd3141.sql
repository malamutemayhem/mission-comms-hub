ALTER TABLE public.messages ADD COLUMN mentions text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.messages ADD COLUMN requires_attention boolean NOT NULL DEFAULT false;