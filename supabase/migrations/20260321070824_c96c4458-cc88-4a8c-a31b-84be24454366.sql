-- Create messages table for Mission Comms
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sender text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('human', 'claude', 'bailey', 'system')),
  content text NOT NULL,
  channel text NOT NULL DEFAULT 'general',
  read_by_human boolean NOT NULL DEFAULT false,
  pinned boolean NOT NULL DEFAULT false,
  client_message_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS (permissive for now - internal tool)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages (internal tool, no auth yet)
CREATE POLICY "Anyone can read messages" ON public.messages FOR SELECT USING (true);

-- Allow anyone to insert messages (Bailey posts via REST)
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Allow anyone to update messages (mark read, etc.)
CREATE POLICY "Anyone can update messages" ON public.messages FOR UPDATE USING (true);

-- Indexes
CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);
CREATE INDEX idx_messages_channel ON public.messages (channel);
CREATE INDEX idx_messages_read_by_human ON public.messages (read_by_human);
CREATE INDEX idx_messages_client_message_id ON public.messages (client_message_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;