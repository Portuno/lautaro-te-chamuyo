
import { cn } from "@/lib/utils";

interface Props {
  sender: "user" | "lautaro";
  content: string;
  mood?: "amable" | "picaro" | "tierno";
  time?: string;
}
const MOOD_BG: Record<string, string> = {
  amable: "bg-coral/80",
  picaro: "bg-terracota/90",
  tierno: "bg-vino/90 animate-pulse",
  neutral: "bg-white dark:bg-[#26121a]",
};

const ChatMessageBubble = ({ sender, content, mood = "amable", time }: Props) => {
  const isLautaro = sender === "lautaro";
  return (
    <div className={cn(
      "flex w-full items-end gap-2 mb-2",
      isLautaro ? "justify-start" : "justify-end"
    )}>
      {isLautaro && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral via-vino to-terracota flex items-center justify-center text-xl font-bold text-beige shadow shrink-0 mb-3">
          🤵‍♂️
        </div>
      )}
      <div className={cn(
        "relative max-w-[82%] px-4 py-2 rounded-3xl shadow transition-all whitespace-pre-wrap break-words",
        isLautaro
          ? MOOD_BG[mood] || MOOD_BG["amable"]
          : "bg-white dark:bg-[#23131c] border border-beige/40"
      )}>
        <span className={cn(
          "block text-[15px] leading-relaxed",
          isLautaro
            ? "text-vino dark:text-beige"
            : "text-vino/90 dark:text-beige"
        )}>{content}</span>
        {time && (
          <span className="absolute bottom-1 right-2 text-[11px] text-vino/40">{time}</span>
        )}
      </div>
      {!isLautaro && (
        <div className="w-7 h-7 rounded-full bg-vino/30 flex items-center justify-center text-sm font-bold text-vino shadow shrink-0 mb-3">
          <span>V</span>
        </div>
      )}
    </div>
  );
};
export default ChatMessageBubble;
