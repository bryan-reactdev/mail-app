import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/entities";
import { 
    AccionesColumn, 
    EmailColumn, 
    TextColumn, 
    CustomCellColumn 
} from "./TableColumnDefinitions";
import { UsuarioEditarButton, UsuarioEliminarButton } from "./UsuarioButtons";
import { ContextMenuSeparator } from "@/components/ui/context-menu";
import { Badge } from "../ui/badge";

export const usuariosTodosColumns: ColumnDef<User>[] = [
    EmailColumn<User>() as ColumnDef<User>,
    TextColumn<User>("firstName", "Nombres", 150) as ColumnDef<User>,
    TextColumn<User>("lastName", "Apellidos", 150) as ColumnDef<User>,
    CustomCellColumn<User>(
        "role",
        "Rol",
        ({ row }) => {
            const role = row.original.role;
            return (
                <Badge variant={`${role === "admin" ? "default" : "secondary"}`}>{role || "Sin rol"}</Badge>
            );
        },
        120
    ) as ColumnDef<User>,
    AccionesColumn('acciones', [
        <UsuarioEditarButton key="edit" />,
        <ContextMenuSeparator key="separator" className='w-full bg-primary/10 !m-0 !p-0' />,
        <UsuarioEliminarButton key="delete" />,
    ]) as ColumnDef<User>,
]

