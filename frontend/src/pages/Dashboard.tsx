import Layout from "./Layout";
import MenuCard from "@/components/cards/MenuCard";
import { Calendar, FileText, Folder, History, PencilRuler, Users } from "lucide-react";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import Title from "@/components/Title";

export default function Dashboard() {
    const menuItems = [
        {
            icon: Folder,
            title: "Projects",
            description: "Create new projects, or manage existing ones.",
            buttonText: "Manage Projects",
            to: "/projects"
        },
        {
            icon: PencilRuler,
            title: "Estimations",
            description: "Create new estimations, or manage existing ones.",
            buttonText: "Manage Estimations",
            to: "/estimations"
        },
        {
            icon: FileText,
            title: "Reports",
            description: "Manage your existing reports, or create a new one.",
            buttonText: "Manage Reports",
            to: "/reports"
        },
        {
            icon: Calendar,
            title: "Appointments",
            description: "Manage your existing appointments, or create a new one.",
            buttonText: "Manage Appointments",
            to: "/appointments"
        },
        {
            icon: Users,
            title: "Users",
            description: "Manage existing users, or register a new one.",
            buttonText: "Manage Users",
            to: "/users"
        },
        {
            icon: History,
            title: "Audit History",
            description: "View the audit history of the user actions in the system.",
            buttonText: "View Audit History",
            to: "/audit"
        }
    ];

    return (
        <Layout>
            <div className="w-full h-full flex flex-col p-4 py-8">
                <Title text="Welcome, Edgar!" />

                {/* <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                Dashboard
                            </BreadcrumbPage>
                        </BreadcrumbItem>                        
                    </BreadcrumbList>
                </Breadcrumb> */}

                <div className="grid grid-cols-4 gap-4 mt-4">
                    {menuItems.map((item, idx0) => {
                        const idx = idx0 + 2; // make index start at 1

                        return (
                            <Effect key={idx} slide fade delay={idx * 50} className="w-full h-full">
                                <MenuCard
                                    className="w-full h-full"
                                    key={item.title}
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                    buttonText={item.buttonText}
                                    to={item.to}
                                />
                            </Effect>
                        );
                    })}
                </div>
            </div>
        </Layout>
    )
}