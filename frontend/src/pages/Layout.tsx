import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import ClickSpark from "@/components/ClickSpark";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark>
      <SidebarProvider>
          <AppSidebar/>
          <main className="relative bg-sidebar">
            {/* <div className="absolute inset-0 bg-black/60 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/app/bg.webp)', backgroundAttachment: 'fixed' }}/> */}
            <div className="absolute inset-0 bg-black/60 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/app/test.jpg)', backgroundAttachment: 'fixed' }}/>
            {/* <div className="absolute inset-0 bg-black/60 bg-center" style={{ backgroundImage: 'url(/images/app/test.jpg)', backgroundAttachment: 'fixed' }}/> */}
            <div className="absolute inset-0 bg-black/70"/>
              <div className="w-full flex items-center gap-2 md:gap-4 bg-sidebar p-2 md:p-4 relative z-50">
                <SidebarTrigger className="p-2 shrink-0"/>
                
                <div className="flex-1 min-w-0">
                  <AppNavbar/>
                </div>
              </div>
              
              {/* <div className="page relative w-full h-full flex flex-col px-4 py-8 rounded-xl z-10"> */}
              <div className="w-full flex flex-col px-4 pt-8 pb-2 rounded-xl z-10">
                  {children}
              </div>
          </main>
      </SidebarProvider>
    </ClickSpark>
  )
}
