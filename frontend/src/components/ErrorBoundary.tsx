import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Effect className="w-full max-w-md" slide fade delay={50}>
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangle className="size-12 text-destructive" />
            </EmptyMedia>
            <EmptyTitle>Uh oh... Algo salió mal</EmptyTitle>
            <EmptyDescription>
              {error?.message || "Ocurrió un error inesperado. Por favor, intenta nuevamente."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="default"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recargar página
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Volver a la página principal
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </Effect>
    </div>
  );
}

export default function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}

