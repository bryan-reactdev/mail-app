import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import SplitText, { type SplitTextProps } from "@/components/SplitText";
import type { LucideIcon } from "lucide-react";

export interface TitleProps extends Omit<SplitTextProps, 'text'> {
  text: string;
  icon?: LucideIcon;
  effectDelay?: number;
  effectSlide?: boolean;
  effectFade?: boolean;
}

export default function Title({
  text,
  icon: Icon,
  effectDelay = 0,
  effectSlide = true,
  effectFade = true,
  className = "text-4xl font-bold text-center font-ztnature",
  delay = 40,
  duration = 0.2,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "h1",
  ...splitTextProps
}: TitleProps) {
  return (
    <Effect slide={effectSlide} fade={effectFade} delay={effectDelay}>
      <div className="flex items-center gap-2">
        {Icon && <Icon />}
        <SplitText
          text={text}
          className={className}
          delay={delay}
          duration={duration}
          ease={ease}
          splitType={splitType}
          from={from}
          to={to}
          threshold={threshold}
          rootMargin={"0px"}
          textAlign={textAlign}
          tag={tag}
          {...splitTextProps}
        />
      </div>
    </Effect>
  );
}

