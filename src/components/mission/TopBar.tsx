import { Radio } from "lucide-react";

interface Props {
  connected: boolean;
  totalMessages: number;
}

export function TopBar({ connected, totalMessages }: Props) {
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-2">
        <Radio className="w-5 h-5 text-primary" />
        <h1 className="text-base font-semibold tracking-tight text-foreground">Mission Comms</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              connected ? "bg-emerald-500" : "bg-red-500"
            )}
          />
          <span className="text-[11px] text-muted-foreground">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {totalMessages > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
            {totalMessages}
          </span>
        )}
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
