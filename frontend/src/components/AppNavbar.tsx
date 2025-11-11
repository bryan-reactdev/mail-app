import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChevronDown, Languages, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { RippleButton, RippleButtonRipples } from "./animate-ui/components/buttons/ripple";

export default function AppNavbar() {
    return (
        <div className="w-full border-none">
            <ButtonGroup className="flex w-full justify-between px-4">
                <ButtonGroup className="flex items-center">
                    <Button variant={"link"}>
                        <h1 className="text-2xl font-extrabold font-ztnature">BIOVAC</h1>
                    </Button>
                </ButtonGroup>

                <div className="flex flex-row">
                    {/* <Button variant={"link"} onClick={onLoginClick}>Log in</Button> */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"}>
                                <Languages/> 
                                Language
                                <ChevronDown/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Languages/> English
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Languages/> Spanish
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <RippleButton variant={"default"}>
                        <LogOut/> Log Out
                        <RippleButtonRipples/>
                    </RippleButton>
                </div>
            </ButtonGroup>
        </div>
    );
}
