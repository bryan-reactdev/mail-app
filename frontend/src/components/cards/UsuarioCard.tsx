import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UsuarioButtons from "@/components/table/UsuarioButtons";
import type { User } from "@/types/entities";

interface UsuarioCardProps {
    row: { original: User };
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    onClick?: (user: User) => void;
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({
    row,
    onEdit,
    onDelete,
    onClick,
}) => {
    const user = row.original;

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick?.(user)}
        >
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-semibold">
                            {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground font-normal">
                            {user.email}
                        </span>
                    </div>
                    {user.role && (
                        <Badge variant="secondary">{user.role}</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        ID: {user.id}
                    </span>
                    <UsuarioButtons
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default UsuarioCard;

