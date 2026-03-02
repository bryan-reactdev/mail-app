import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { Users, Home, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

type SidebarItem = {
    label: string;
    icon: LucideIcon;
    to: string;
    adminOnly?: boolean;
    agentOnly?: boolean;
};

export default function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();
  const { currentUser } = useUserStore();
  const isAdmin = currentUser?.role === "admin";

  const menuItems: SidebarItem[] = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/app/",
      adminOnly: false,
    },
    {
      label: "Statistics",
      icon: BarChart3,
      to: "/app/statistics",
      adminOnly: false,
    },
    {
      label: "Usuarios",
      icon: Users,
      to: "/app/users",
      adminOnly: true,
    },
  ].filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <Sidebar>
        <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Menu</SidebarGroupLabel>

                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.map((item) => {
                        const isActive = window.location.pathname.replace(/\/$/, '') === item.to.replace(/\/$/, '');
                        const menuEntry = (
                          <SidebarMenuItem key={item.to}>
                            <SidebarMenuButton asChild isActive={isActive} className="text-sidebar-foreground">
                              <Link
                                to={item.to}
                                onClick={() => {
                                  if (isMobile) {
                                    setOpenMobile(false);
                                  }
                                }}
                              >
                                <item.icon />
                                <span className="font-normal text-sm">{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );

                        return menuEntry;
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        <SidebarFooter />
    </Sidebar>
  )
}
