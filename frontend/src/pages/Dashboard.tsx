import Layout from "./Layout";
import MenuCard from "@/components/cards/MenuCard";
import { Users, Home, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import { useUserStore } from "@/stores/useUserStore";

type DashboardMenuItem = {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    to: string;
    adminOnly?: boolean;
};

export default function Dashboard() {
    const { currentUser } = useUserStore();
    const isAdmin = currentUser?.role === "admin";

    const menuItems: DashboardMenuItem[] = [
        {
            icon: Home,
            title: "Dashboard",
            description: "Overview and quick access",
            buttonText: "Open",
            to: "/app/",
            adminOnly: false,
        },
        {
            icon: BarChart3,
            title: "Statistics",
            description: "View login stats and app usage",
            buttonText: "View Statistics",
            to: "/app/statistics",
            adminOnly: false,
        },
        {
            icon: Users,
            title: "Usuarios",
            description: "Manage users",
            buttonText: "Manage Users",
            to: "/app/users",
            adminOnly: true,
        },
    ].filter(item => !item.adminOnly || isAdmin);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {menuItems.map((item, idx0) => {
                        const idx = idx0 + 2;
                        const itemKey = item.to;

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
            </div>
        </Layout>
    )
}
