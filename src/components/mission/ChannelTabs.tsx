import { CHANNELS, type Channel } from "@/lib/messages";
import { cn } from "@/lib/utils";

interface Props {
  active: Channel;
  onChange: (ch: Channel) => void;
  unreadCounts: Record<string, number>;
}

const channelLabels: Record<string, string> = {
  general: "General",
  tasks: "Tasks",
  plex: "Plex",
  "finance-app": "Finance App",
};

export function ChannelTabs({ active, onChange, unreadCounts }: Props) {
  return (
    <div className="flex gap-1 px-4 py-2 border-b border-border bg-card overflow-x-auto">
      {CHANNELS.map((ch) => {
        const unread = unreadCounts[ch] ?? 0;
        return (
          <button
            key={ch}
            onClick={() => onChange(ch)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap relative active:scale-[0.97]",
              active === ch
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {channelLabels[ch] ?? ch}
            {unread > 0 && active !== ch && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[hsl(var(--channel-unread))] text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
