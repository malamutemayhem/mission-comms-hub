import { cn } from "@/lib/utils";

export type AttentionFilterValue = "all" | "attention" | "mentions-bailey" | "mentions-claude";

interface Props {
  active: AttentionFilterValue;
  onChange: (v: AttentionFilterValue) => void;
}

const options: { value: AttentionFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "attention", label: "Needs Attention" },
  { value: "mentions-bailey", label: "Mentions Bailey" },
  { value: "mentions-claude", label: "Mentions Claude" },
];

export function AttentionFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 px-4 py-1.5 border-b border-border bg-card/50">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-2 py-1 rounded text-xs font-medium transition-colors active:scale-[0.97]",
            active === opt.value
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
