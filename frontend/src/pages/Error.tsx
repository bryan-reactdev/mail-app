import { useNavigate, useRouteError, isRouteErrorResponse, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import Layout from "./Layout";

export default function Error() {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you are looking for does not exist or has been moved.";
    } else if (error.status === 403) {
      title = "Access Forbidden";
      message = "You don't have permission to access this page.";
    } else if (error.status === 500) {
      title = "Server Error";
      message = "Something went wrong on our end. Please try again later.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = (error as Error).message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message);
  }

  const errorContent = (
    <Effect className="w-full max-w-md" slide fade delay={50}>
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="size-12 text-destructive" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="default"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(isAppRoute ? "/app/" : "/")}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </Effect>
  );

  if (isAppRoute) {
    return (
      <Layout>
        <div className="w-full h-full flex items-center justify-center">
          {errorContent}
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      {errorContent}
    </div>
  );
}

