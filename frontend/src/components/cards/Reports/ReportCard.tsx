import { Calendar, User, Trash, Edit, Printer } from "lucide-react";
import { formatDateTime } from "@/util/dateUtil";
import type { Report } from "@/types/entities";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";
import { ButtonGroup } from "@/components/ui/button-group";
import { useTranslation } from "@/i18n/useTranslation";

interface ReportCardProps {
  report: Report;
  className?: string;
  onEdit?: () => void;
  onPDF?: () => void;
  onDelete?: () => void;
}

const ReportCard = ({ report, className, onEdit, onPDF, onDelete }: ReportCardProps) => {
  const { t } = useTranslation();
  
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handlePDFClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onPDF?.();
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={`p-3 md:p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors ${className || ""}`}
    >
      <div className="flex flex-col gap-3 h-full">
        <div className="flex-1 space-y-2">
          {/* Nombre del proyecto */}
          <p className="font-semibold text-sm md:text-base text-foreground line-clamp-2">{report.project?.title || report.client}</p>
          
          {/* Información: Autor y Fecha */}
          <div className="flex flex-col items-start gap-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 md:h-4 md:w-4 shrink-0" /> 
              <span className="truncate">{report.author?.name || "Unknown"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 md:h-4 md:w-4 shrink-0" /> 
              <span className="truncate">{formatDateTime(report.interventionDate)}</span>
            </span>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="mt-auto pt-2">
          <ButtonGroup className="w-full flex flex-col gap-1.5">
            {onEdit && (
              <RippleButton variant="outline" size="sm" onClick={handleEditClick} className="w-full h-8 md:h-9 px-2 md:px-3">
                <Edit className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                <span className="text-[10px] md:text-xs whitespace-nowrap">{t("reports.actions.viewEdit")}</span>
                <RippleButtonRipples/>
              </RippleButton>
            )}
            {onPDF && (
              <RippleButton variant="outline" size="sm" onClick={handlePDFClick} className="w-full h-8 md:h-9 px-2 md:px-3">
                <Printer className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                <span className="text-[10px] md:text-xs whitespace-nowrap">{t("reports.actions.pdf")}</span>
                <RippleButtonRipples/>
              </RippleButton>
            )}
            {onDelete && (
              <RippleButton variant="destructive" size="sm" onClick={handleDeleteClick} className="w-full h-8 md:h-9 px-2 md:px-3">
                <Trash className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                <span className="text-[10px] md:text-xs whitespace-nowrap">{t("reports.actions.delete")}</span>
                <RippleButtonRipples/>
              </RippleButton>
            )}
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

