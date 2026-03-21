/**
 * Mission Comms - Message Service Layer
 *
 * Bailey can POST messages directly to Supabase REST:
 * POST {SUPABASE_URL}/rest/v1/messages
 * Headers:
 *   apikey: {ANON_KEY}
 *   Authorization: Bearer {ANON_KEY}
 *   Content-Type: application/json
 *   Prefer: return=minimal
 * Body:
 *   {"sender":"Bailey","sender_type":"bailey","content":"message here","channel":"general"}
 */

import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type Message = Tables<"messages">;
export type MessageInsert = TablesInsert<"messages">;

export const CHANNELS = ["general", "tasks", "plex", "finance-app"] as const;
export type Channel = (typeof CHANNELS)[number];

export const SENDER_TYPES = ["human", "claude", "bailey", "system"] as const;
export type SenderType = (typeof SENDER_TYPES)[number];

export async function fetchMessages(channel: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel", channel)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(msg: MessageInsert): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert(msg)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markReadByHuman(id: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ read_by_human: true })
    .eq("id", id);
  if (error) throw error;
}

export async function getUnreadCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const ch of CHANNELS) {
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("channel", ch)
      .eq("read_by_human", false)
      .neq("sender_type", "human");
    if (!error) counts[ch] = count ?? 0;
  }
  return counts;
}

export async function getBaileyAttentionCount(): Promise<number> {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("requires_attention", true)
    .eq("read_by_human", false)
    .contains("mentions", ["Bailey"]);
  if (error) return 0;
  return count ?? 0;
}

export function subscribeToChannel(
  channel: string,
  onInsert: (msg: Message) => void
): RealtimeChannel {
  return supabase
    .channel(`messages:${channel}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel=eq.${channel}`,
      },
      (payload) => {
        onInsert(payload.new as Message);
      }
    )
    .subscribe();
}

export function unsubscribe(sub: RealtimeChannel) {
  supabase.removeChannel(sub);
}
