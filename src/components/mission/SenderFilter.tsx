import { SENDER_TYPES } from "@/lib/messages";
import { cn } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (filter: string) => void;
}

const labels: Record<string, string> = {
  all: "All",
  human: "Chris",
  claude: "Claude",
  bailey: "Bailey",
  system: "System",
};

export function SenderFilter({ active, onChange }: Props) {
  const options = ["all", ...SENDER_TYPES];
  return (
    <div className="flex gap-1 px-4 py-1.5 border-b border-border bg-card/50">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-2 py-1 rounded text-xs font-medium transition-colors active:scale-[0.97]",
            active === opt
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}
