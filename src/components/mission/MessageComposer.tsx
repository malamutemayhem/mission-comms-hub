import { useState, useRef, useCallback } from "react";
import { Send, AtSign, Sparkles } from "lucide-react";
import { sendMessage, type Channel } from "@/lib/messages";
import { cn } from "@/lib/utils";

interface Props {
  channel: Channel;
}

export function MessageComposer({ channel }: Props) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [mentionBailey, setMentionBailey] = useState(false);
  const [mentionClaude, setMentionClaude] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const buildMentions = () => {
    const m: string[] = [];
    if (mentionBailey) m.push("Bailey");
    if (mentionClaude) m.push("Claude");
    return m;
  };

  const handleSend = useCallback(async (forcePing = false) => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    const mentions = forcePing ? ["Bailey"] : buildMentions();
    const requires_attention = forcePing || mentionBailey;

    setSending(true);
    try {
      await sendMessage({
        sender: "Chris",
        sender_type: "human",
        content: trimmed,
        channel,
        mentions,
        requires_attention,
      });
      setContent("");
      setMentionBailey(false);
      setMentionClaude(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }, [content, channel, sending, mentionBailey, mentionClaude]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className="border-t border-border bg-card px-4 py-3">
      {/* Mention toggles */}
      <div className="flex gap-1.5 mb-2">
        <button
          type="button"
          onClick={() => setMentionBailey(!mentionBailey)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors active:scale-[0.97]",
            mentionBailey
              ? "bg-[hsl(var(--sender-bailey))] text-white"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <AtSign className="w-3 h-3" />
          Bailey
        </button>
        <button
          type="button"
          onClick={() => setMentionClaude(!mentionClaude)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors active:scale-[0.97]",
            mentionClaude
              ? "bg-[hsl(var(--sender-claude))] text-white"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <AtSign className="w-3 h-3" />
          Claude
        </button>
      </div>

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); handleInput(); }}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channel}...`}
          rows={1}
          className="flex-1 bg-secondary text-foreground rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          disabled={sending}
        />
        <button
          onClick={() => handleSend(true)}
          disabled={!content.trim() || sending}
          className="px-3 py-2.5 rounded-lg bg-[hsl(var(--sender-bailey))] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 active:scale-95"
          title="Send with @Bailey + requires attention"
        >
          Ping Bailey
        </button>
        <button
          onClick={() => handleSend()}
          disabled={!content.trim() || sending}
          className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">
        Enter to send · Shift+Enter for newline · @Bailey to ping · Sending as Chris
      </p>
    </div>
  );
}
