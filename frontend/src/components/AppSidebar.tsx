import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { Folder, History, Home, Users, Wrench } from "lucide-react";
import RoleRestricted from "./access/RoleRestricted";

type SidebarRole = "admin" | "supervisor" | "secretary";

type SidebarItem = {
    label: string;
    icon: typeof Home;
    to: string;
    roles?: SidebarRole[];
};

export default function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();

  const menuItems: SidebarItem[] = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/",
    },
    {
      label: "Projects",
      icon: Folder,
      to: "/projects/agenda",
    },
    {
      label: "Tools",
      icon: Wrench,
      to: "/tools",
      roles: ["admin", "supervisor"],
    },
    {
      label: "Users",
      icon: Users,
      to: "/users",
    },
    {
      label: "Audit History",
      icon: History,
      to: "/audit",
    },
  ]

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
                            <SidebarMenuButton asChild>
                              <Link
                                  className={`h-10 justify-start text-muted-foreground ${isActive ? 'bg-accent !text-white' : ''}`}
                                to={item.to}
                                onClick={() => {
                                  // Cerrar el sidebar en móvil al hacer clic en un item
                                  if (isMobile) {
                                    setOpenMobile(false);
                                  }
                                }}
                              >
                                <item.icon />
                                <span className="font-normal">{item.label}</span>
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
