/**
 * Mission Comms - Shared Multi-Agent Communication Hub
 *
 * Bailey REST endpoint for sending messages:
 * POST {VITE_SUPABASE_URL}/rest/v1/messages
 * Headers:
 *   apikey: {VITE_SUPABASE_PUBLISHABLE_KEY}
 *   Authorization: Bearer {VITE_SUPABASE_PUBLISHABLE_KEY}
 *   Content-Type: application/json
 *   Prefer: return=minimal
 * Body:
 *   {"sender":"Bailey","sender_type":"bailey","content":"your message","channel":"general","mentions":["Bailey"],"requires_attention":true}
 *
 * Chris uses this UI.
 * Claude can use the same table via app/API later.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchMessages,
  subscribeToChannel,
  unsubscribe,
  getUnreadCounts,
  getBaileyAttentionCount,
  type Message,
  type Channel,
  CHANNELS,
} from "@/lib/messages";
import { TopBar } from "@/components/mission/TopBar";
import { ChannelTabs } from "@/components/mission/ChannelTabs";
import { SenderFilter } from "@/components/mission/SenderFilter";
import { AttentionFilter, type AttentionFilterValue } from "@/components/mission/AttentionFilter";
import { MessageBubble } from "@/components/mission/MessageBubble";
import { MessageComposer } from "@/components/mission/MessageComposer";
import { MessageSquare } from "lucide-react";

export default function MissionComms() {
  const [channel, setChannel] = useState<Channel>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderFilter, setSenderFilter] = useState("all");
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilterValue>("all");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [baileyAttention, setBaileyAttention] = useState(0);
  const [connected, setConnected] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const feedRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const scrollToBottom = useCallback(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const checkNearBottom = useCallback(() => {
    const el = feedRef.current;
    if (!el) return;
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (isNearBottom.current) setHasNew(false);
  }, []);

  // Load messages
  useEffect(() => {
    setLoading(true);
    fetchMessages(channel)
      .then((msgs) => {
        setMessages(msgs);
        setLoading(false);
        setTimeout(scrollToBottom, 50);
      })
      .catch(() => setLoading(false));
  }, [channel, scrollToBottom]);

  // Realtime subscription
  useEffect(() => {
    setConnected(false);
    const sub = subscribeToChannel(channel, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      if (isNearBottom.current) {
        setTimeout(scrollToBottom, 50);
      } else {
        setHasNew(true);
      }
    });

    const timer = setTimeout(() => setConnected(true), 1000);

    return () => {
      clearTimeout(timer);
      unsubscribe(sub);
    };
  }, [channel, scrollToBottom]);

  // Unread counts + bailey attention
  useEffect(() => {
    const refresh = () => {
      getUnreadCounts().then(setUnreadCounts);
      getBaileyAttentionCount().then(setBaileyAttention);
    };
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [messages]);

  // Apply filters
  let filtered = messages;
  if (senderFilter !== "all") {
    filtered = filtered.filter((m) => m.sender_type === senderFilter);
  }
  if (attentionFilter === "attention") {
    filtered = filtered.filter((m) => (m as any).requires_attention === true);
  } else if (attentionFilter === "mentions-bailey") {
    filtered = filtered.filter((m) => {
      const mentions = (m as any).mentions;
      return Array.isArray(mentions) && mentions.includes("Bailey");
    });
  } else if (attentionFilter === "mentions-claude") {
    filtered = filtered.filter((m) => {
      const mentions = (m as any).mentions;
      return Array.isArray(mentions) && mentions.includes("Claude");
    });
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar connected={connected} totalMessages={messages.length} baileyAttention={baileyAttention} />
      <ChannelTabs active={channel} onChange={setChannel} unreadCounts={unreadCounts} />
      <SenderFilter active={senderFilter} onChange={setSenderFilter} />
      <AttentionFilter active={attentionFilter} onChange={setAttentionFilter} />

      {/* Message Feed */}
      <div
        ref={feedRef}
        onScroll={checkNearBottom}
        className="flex-1 overflow-y-auto px-4 py-3 relative"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            <MessageSquare className="w-10 h-10 opacity-30" />
            <p className="text-sm">No messages in #{channel} yet</p>
            <p className="text-xs opacity-60">Send a message, or use <strong>@Bailey</strong> / <strong>Ping Bailey</strong> when you want Bailey to actively respond.</p>
            <p className="text-xs opacity-60">Messages can also be posted normally without mentions.</p>
          </div>
        ) : (
          filtered.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {hasNew && (
          <button
            onClick={() => { scrollToBottom(); setHasNew(false); }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:opacity-90 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 z-10"
          >
            ↓ New messages
          </button>
        )}
      </div>

      <MessageComposer channel={channel} />
    </div>
  );
}
