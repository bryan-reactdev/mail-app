import { CheckCircle2, Clock, Lock, Ban } from "lucide-react";
import { PROPERTY_STATUS, PROPERTY_STATUS_OPTIONS, type PropertyStatus } from "@/constants/propertyStatus";

export const getStatusBadgeVariant = (
    status: PropertyStatus | null | undefined
): "available" | "sold" | "pending" | "reserved" | "off-market" | "default" => {
    if (!status) return "default";
    switch (status) {
        case PROPERTY_STATUS.AVAILABLE:
            return "available";
        case PROPERTY_STATUS.SOLD:
            return "sold";
        case PROPERTY_STATUS.PENDING:
            return "pending";
        case PROPERTY_STATUS.RESERVED:
            return "reserved";
        case PROPERTY_STATUS.OFF_MARKET:
            return "off-market";
        default:
            return "default";
    }
};

export const getStatusLabel = (status: PropertyStatus | null | undefined): string => {
    if (!status) return "";
    const option = PROPERTY_STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.label || status;
};

export const getStatusIcon = (status: PropertyStatus | null | undefined) => {
    if (!status) return null;
    switch (status) {
        case PROPERTY_STATUS.AVAILABLE:
            return <CheckCircle2 className="h-3 w-3" />;
        case PROPERTY_STATUS.SOLD:
            return <CheckCircle2 className="h-3 w-3" />;
        case PROPERTY_STATUS.PENDING:
            return <Clock className="h-3 w-3" />;
        case PROPERTY_STATUS.RESERVED:
            return <Lock className="h-3 w-3" />;
        case PROPERTY_STATUS.OFF_MARKET:
            return <Ban className="h-3 w-3" />;
        default:
            return null;
    }
};

