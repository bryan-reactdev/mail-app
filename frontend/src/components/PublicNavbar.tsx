import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";

export default function PublicNavbar() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="w-full flex items-center mx-auto gap-2 md:gap-4 bg-sidebar p-2 md:p-4 relative z-50">
            <div className="w-[80%] flex items-center justify-between mx-auto px-2 md:px-4">
                <Button
                    variant="link"
                    onClick={() => navigate("/")}
                    className="cursor-pointer p-0 h-auto"
                    tabIndex={0}
                    aria-label="Go to Home"
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate("/");
                        }
                    }}
                >
                    <h1 className="text-2xl md:text-4xl font-extrabold font-ztnature cursor-pointer">Base App</h1>
                </Button>

                <div className="flex flex-row items-center gap-4 md:gap-6">
                    <Button
                        variant="link"
                        onClick={() => navigate("/")}
                        className="text-foreground hover:text-primary h-auto p-0 font-normal"
                    >
                        <span className="hidden sm:inline">Inicio</span>
                    </Button>
                    <RippleButton 
                        variant="default" 
                        onClick={handleLoginClick}
                        size="sm"
                        className="h-9 md:h-10 px-2 md:px-4"
                    >
                        <LogIn className="h-4 w-4 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Login</span>
                        <RippleButtonRipples />
                    </RippleButton>
                </div>
            </div>
        </div>
    );
}

