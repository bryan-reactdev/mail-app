import { LogOut } from "lucide-react";
import { RippleButton, RippleButtonRipples } from "./animate-ui/components/buttons/ripple";
import { useUserStore } from "@/stores/useUserStore";
import { Link } from "react-router-dom";

export default function AppNavbar() {
    const { logout } = useUserStore();
    return (
        <div className="w-full border-none">
            <div className="relative flex items-center justify-between w-full px-2 md:px-4 h-16 gap-2">
                {/* Left (BIOVAC logo) - Mobile */}
                <div className="flex md:hidden">
                    <Link
                        to="/"
                        className="cursor-pointer p-0 h-auto"
                        tabIndex={0}
                        aria-label="Go to Home"
                    >
                        <h1 className="text-2xl font-bold font-ztnature cursor-pointer">Base App</h1>
                    </Link>
                </div>

                {/* Center (BIOVAC logo) - Desktop */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <Link
                        to="/"
                        className="cursor-pointer p-0 h-auto"
                        aria-label="Go to Home"
                    >
                        <h1 className="text-4xl font-bold font-ztnature cursor-pointer">Base App</h1>
                    </Link>
                </div>
                
                {/* Right (Language & Log Out) */}
                <div className="flex flex-row items-center gap-3 md:gap-4 ml-auto">
                    {/* Separador visual */}
                    <div className="h-6 w-px bg-border/50 hidden sm:block" />

                    <RippleButton 
                        variant="default" 
                        onClick={() => logout()}
                        size="sm"
                        className="h-9 md:h-10 px-2 md:px-4"
                    >
                        <LogOut className="h-4 w-4 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Cerrar sesión</span>
                        <RippleButtonRipples />
                    </RippleButton>
                </div>
            </div>
        </div>
    );
}
