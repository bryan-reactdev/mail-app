import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import type { LucideIcon } from "lucide-react";

interface BenefitCardProps {
    title: string;
    icon: LucideIcon;
    description: string;
    className?: string;
}

export default function BenefitCard({ 
    title, 
    icon: Icon,
    description,
    className = ""
}: BenefitCardProps) {
    return (  
        <Effect slide fade delay={0}>
            <div className={`relative w-full h-full min-h-[200px] rounded-lg flex flex-col items-center justify-center p-6 bg-white/25 transition-all duration-300 ${className}`}>
                {/* Icon */}
                <div className="mb-4 p-4 rounded-full bg-white/30 ring-2 ring-black/10">
                    <Icon className="w-5 h-5 text-black/60" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl text-center text-shadow-regular text-black/60 mb-2">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-center text-black/60">
                        {description}
                    </p>
                )}
            </div>
        </Effect>
    );
}

