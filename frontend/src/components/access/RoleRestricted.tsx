import type { PropsWithChildren, ReactNode } from "react";
import { useUserStore } from "@/stores/useUserStore";

type RoleRestrictedProps = {
    roles?: string[];
    fallback?: ReactNode;
};

const RoleRestricted = ({ roles = [], fallback = null, children }: PropsWithChildren<RoleRestrictedProps>) => {
    const { currentUser } = useUserStore();
    const userRole = currentUser?.role ?? null;

    if (roles.length === 0) {
        return <>{children}</>;
    }

    if (!userRole) {
        return <>{fallback}</>;
    }

    // Admin siempre tiene acceso a todo
    if (userRole === "admin") {
        return <>{children}</>;
    }

    const canAccess = roles.includes(userRole);

    if (!canAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default RoleRestricted;

