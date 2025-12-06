import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TabsProps {
  tabs: any[];
  currentTab?: string;
  setCurrentTab?: (tab: any) => void;
  className?: string;
}

export default function Tabs({ tabs, currentTab, setCurrentTab, className }: TabsProps) {
  const navigate = useNavigate();

  const handleEstadoChange = (tab: any) => {
    setCurrentTab?.(
      {
        label: tab.label ?? 'Todos',
        columns: tab.columnDefinitions ?? null,
        card: tab.card ?? null,
        data: tab.data ?? null,
        value: tab.value ?? null
      },
    );

    if ((currentTab != tab.label) && !isMobile){
      navigate(`?tab=${tab.label}`, { replace: false });
    }
  }

  return (
    <div className={`tabs-container ${className}`}>
      {tabs.map((tab: any) => {
        const isActive = currentTab === tab.label;
        
        return (
          <Button
              key={tab.label}
              style={{
                background: isActive 
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.15)",
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "white",
                border: isActive 
                  ? "1px solid rgba(255,255,255,0.5)"
                  : "1px solid rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.15s ease"
              }}
              className={`flex gap-2 ${isActive ? 'active-tab' : 'inactive-tab'}`}
              onClick={() => handleEstadoChange(tab)}
            >
            <span className="text-xs font-medium" style={{ color: "white" }}>{tab.label}</span>

            {tab.value && (
              <Badge 
                className="!text-primary-foreground text-xs font-medium" 
                variant="secondary"
                style={{
                  background: "#fff", 
                  color: "white",
                  border: "none"
                }}
              >
                {tab.value}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}