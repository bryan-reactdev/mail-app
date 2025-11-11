import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
    className?: string;
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    to?: string;
}

export default function MenuCard({ className, icon: Icon, title, description, buttonText, to }: MenuCardProps) {
    const navigate = useNavigate();
    return (
        <Card className={`hover:cursor-pointer hover:scale-102 hover:bg-card-hover transition-all duration-100, ${className}`} onClick={() => to && navigate(to ?? "")}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-4 bg-card rounded-md">
                        <Icon/>
                    </div>
                    <h1 className="text-xl font-semibold font-ztnature">{title}</h1>
                </CardTitle>
                <CardDescription className="font-normal font-inter">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full pl-4">
                <CardAction className="w-full">
                    <Button className="w-full justify-start font-outfit" variant={"link"}>
                        {buttonText}
                        <ChevronRight/>
                    </Button>
                </CardAction>
            </CardContent>
        </Card>
    );
}
