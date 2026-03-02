import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { ButtonGroup } from "@/components/ui/button-group";
import Title from "@/components/title";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";
import BaseTable from "@/components/table/BaseTable";
import { usuariosTodosColumns } from "@/components/table/UsuarioColumns";
import UsuarioCard from "@/components/cards/UsuarioCard";
import { useUserStore } from "@/stores/useUserStore";
import { ArrowLeft, Users, UserPlus } from "lucide-react";
import type { Tab } from "@/types/tables";
import type { ColumnDef } from "@tanstack/react-table";
import RegisterUsuarioModal from "@/components/modals/RegisterUsuarioModal";

export default function Usuarios() {
    const navigate = useNavigate();
    const { users, getUsers, isFetchingUsers } = useUserStore();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const [currentTab, setCurrentTab] = useState<Tab>({
        label: "Todos",
        columnDefinitions: usuariosTodosColumns as ColumnDef<unknown>[],
        card: UsuarioCard,
        data: users,
        content: {
            text: "Total: ",
            total: users.length,
            size: users.length,
        },
    });

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        setCurrentTab((prev) => ({
            ...prev,
            data: users,
            content: {
                text: "Total: ",
                total: users.length,
                size: users.length,
            },
        }));
    }, [users]);

    return (
        <Layout>
            <div className="mb-4">
                <Title
                    text="Usuarios"
                    icon={Users}
                    className="text-4xl font-bold font-ztnature"
                    textAlign="left"
                />
            </div>

            <Effect className="flex flex-row items-center gap-2" slide fade delay={50}>
                <ButtonGroup>
                    <RippleButton variant="outline" onClick={() => navigate("/app/")}>
                        <ArrowLeft /> Volver
                        <RippleButtonRipples />
                    </RippleButton>
                    <RippleButton variant="default" onClick={() => setIsRegisterModalOpen(true)}>
                        <UserPlus /> Registrar Usuario
                        <RippleButtonRipples />
                    </RippleButton>
                </ButtonGroup>
            </Effect>

            <Effect className="w-full" slide fade delay={150}>
                <BaseTable
                    data={users}
                    columnDefinitions={usuariosTodosColumns}
                    card={UsuarioCard}
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                    loading={isFetchingUsers}
                    centered={["id", "acciones", "role"]}
                    flexable={["email", "firstName", "lastName", "role"]}
                    searchBarPlaceholder="Buscar usuario..."
                />
            </Effect>

            <RegisterUsuarioModal
                isOpen={isRegisterModalOpen}
                onOpenChange={setIsRegisterModalOpen}
            />
        </Layout>
    );
}

