import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { sendMessage, type Channel } from "@/lib/messages";

interface Props {
  channel: Channel;
}

export function MessageComposer({ channel }: Props) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await sendMessage({
        sender: "Chris",
        sender_type: "human",
        content: trimmed,
        channel,
      });
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }, [content, channel, sending]);

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
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">
        Enter to send · Shift+Enter for newline · Sending as Chris
      </p>
    </div>
  );
}
