import { useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import type { Message } from "@/lib/messages";
import { cn } from "@/lib/utils";

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function melbourneTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const senderConfig: Record<string, { align: "left" | "right" | "center"; color: string; avatar: string | null; bubbleBg: string; bubbleText: string }> = {
  human:  { align: "left",   color: "bg-[hsl(var(--sender-human))]",  avatar: "C", bubbleBg: "bg-[hsl(var(--sender-human))]/12 border border-[hsl(var(--sender-human))]/20", bubbleText: "text-foreground" },
  bailey: { align: "left",   color: "bg-[hsl(var(--sender-bailey))]", avatar: "B", bubbleBg: "bg-[hsl(var(--sender-bailey))]/12 border border-[hsl(var(--sender-bailey))]/20", bubbleText: "text-foreground" },
  claude: { align: "right",  color: "bg-[hsl(var(--sender-claude))]", avatar: "C", bubbleBg: "bg-[hsl(var(--sender-claude))]/12 border border-[hsl(var(--sender-claude))]/20", bubbleText: "text-foreground" },
  system: { align: "center", color: "bg-[hsl(var(--sender-system))]", avatar: null, bubbleBg: "", bubbleText: "" },
};

export function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const config = senderConfig[message.sender_type] ?? senderConfig.system;
  const isSystem = message.sender_type === "system";
  const isRight = config.align === "right";
  const hasMeta = message.metadata && Object.keys(message.metadata as object).length > 0;
  const mentions: string[] = Array.isArray((message as any).mentions) ? (message as any).mentions : [];

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyMetadata = () => {
    navigator.clipboard.writeText(JSON.stringify(message.metadata, null, 2));
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-2 group">
        <div className="max-w-lg px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm italic text-center">
          <span className="font-medium mr-2">{message.sender}</span>
          {message.content}
          <span className="ml-2 text-xs opacity-60">{relativeTime(message.created_at)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2.5 my-2 group",
        isRight ? "justify-end" : "justify-start"
      )}
    >
      {!isRight && (
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-5",
            config.color
          )}
        >
          {config.avatar}
        </div>
      )}

      <div className={cn("max-w-[75%] min-w-[120px]")}>
        <div className={cn("flex items-baseline gap-2 mb-0.5", isRight && "justify-end")}>
          <span className="text-xs font-bold" style={{ color: `hsl(var(--sender-${message.sender_type}))` }}>
            {message.sender}
          </span>
          <span className="text-[10px] text-muted-foreground" title={melbourneTime(message.created_at)}>
            {relativeTime(message.created_at)}
          </span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed relative",
            config.bubbleBg,
            config.bubbleText,
            isRight ? "rounded-br-sm" : "rounded-bl-sm",
            message.requires_attention && "ring-1 ring-[hsl(var(--sender-bailey))]/50"
          )}
        >
          {/* Mention badges */}
          {mentions.length > 0 && (
            <div className="flex gap-1 mb-1.5">
              {mentions.map((m) => (
                <span
                  key={m}
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    m === "Bailey" ? "bg-[hsl(var(--sender-bailey))]/20 text-[hsl(var(--sender-bailey))]" : "bg-[hsl(var(--sender-claude))]/20 text-[hsl(var(--sender-claude))]"
                  )}
                >
                  @{m}
                </span>
              ))}
            </div>
          )}

          <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>

          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
            <button
              onClick={copyContent}
              className="p-1 rounded hover:bg-white/10 text-current"
              title="Copy message"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {!message.read_by_human && !isRight && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--channel-unread))]" />
          )}
        </div>

        {hasMeta && (
          <div className="mt-1">
            <button
              onClick={() => setShowMeta(!showMeta)}
              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ChevronDown className={cn("w-3 h-3 transition-transform", showMeta && "rotate-180")} />
              metadata
            </button>
            {showMeta && (
              <div className="mt-1 relative group/meta">
                <pre className="text-[10px] bg-muted/50 rounded p-2 text-muted-foreground overflow-x-auto max-h-32">
                  {JSON.stringify(message.metadata, null, 2)}
                </pre>
                <button
                  onClick={copyMetadata}
                  className="absolute top-1 right-1 p-1 rounded hover:bg-muted opacity-0 group-hover/meta:opacity-100 transition-opacity"
                  title="Copy raw JSON"
                >
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isRight && (
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-5",
            config.color
          )}
        >
          {config.avatar}
        </div>
      )}
    </div>
  );
}
