import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Calendar, FileText, Folder, History, Home, PencilRuler, Users } from "lucide-react";

export default function AppSidebar() {

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/",
    },
    {
      label: "Projects",
      icon: Folder,
      to: "/projects",
    },
    {
      label: "Estimation",
      icon: PencilRuler,
      to: "/estimation",
    },
    {
      label: "Reports",
      icon: FileText,
      to: "/reports",
    },
    {
      label: "Appointments",
      icon: Calendar,
      to: "/appointments",
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
                      {menuItems.map((item) => (
                        <SidebarMenuItem key={item.to}>
                          <SidebarMenuButton asChild>
                            <Link to={item.to}>
                              <item.icon />
                              <span className="font-normal">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        <SidebarFooter />
    </Sidebar>
  )
}
