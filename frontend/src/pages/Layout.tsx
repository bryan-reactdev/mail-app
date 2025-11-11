import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import ClickSpark from "@/components/ClickSpark";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark>
      <SidebarProvider>
          <AppSidebar/>
          <main className="bg-sidebar">
              <div className="w-full flex items-center justify-between px-4 bg-sidebar p-4 relative z-50">
                <SidebarTrigger className="p-2"/>
                
                <AppNavbar/>
              </div>
              
              <div className="page relative w-full h-full px-4 rounded-xl z-10">

                  {children}
              </div>
          </main>
      </SidebarProvider>
    </ClickSpark>
  )
}
