 import { useState } from "react";
import LoginModal from "@/components/modals/LoginModal";
import Layout from "./Layout";
import MenuCard from "@/components/cards/MenuCard";
import {
    Calendar,
    Folder,
    History,
    Users,
    Wrench,
} from "lucide-react";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import { useUserStore } from "@/stores/useUserStore";

type RestrictedRole = "admin" | "supervisor" | "secretary";

type DashboardMenuItem = {
    icon: typeof Calendar;
    title: string;
    description: string;
    buttonText: string;
    to: string;
    roles?: RestrictedRole[];
};

export default function Dashboard() {
    const { login, isLogging, currentUser } = useUserStore();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const menuItems: DashboardMenuItem[] = [
        {
            icon: Folder,
            title: "Projects",
            description: "Manage and track all projects",
            buttonText: "View Projects",
            to: "/projects/agenda",
            roles: ["admin", "supervisor", "secretary"],
        },
        {
            icon: Wrench,
            title: "Tools",
            description: "Manage and track all tools",
            buttonText: "View Tools",
            to: "/tools",
            roles: ["admin", "supervisor"],
        },
        {
            icon: Users,
            title: "Users",
            description: "Manage and track all users",
            buttonText: "View Users",
            to: "/users",
            roles: ["admin"],
        },
        {
            icon: History,
            title: "Audit History",
            description: "View all audit history",
            buttonText: "View Audit History",
            to: "/audit",
            roles: ["admin"],
        },
    ];

    return (
        <Layout>
            {/* --- Login Modal --- */}
            <LoginModal
                open={isLoginModalOpen}
                onOpenChange={setIsLoginModalOpen}
                onLogin={login}
                isLogging={isLogging}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {menuItems.map((item, idx0) => {
                    const idx = idx0 + 2; // make index start at 1
                    const itemKey = item.to; // Use stable route as key instead of title

                    const card = (
                        <Effect key={itemKey} slide fade delay={idx * 50} className="w-full h-full">
                            <MenuCard
                                className="w-full h-full"
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                                buttonText={item.buttonText}
                                to={item.to}
                            />
                        </Effect>
                    );

                    return <div key={itemKey}>{card}</div>;
                })}
            </div>
        </Layout>
    )
}