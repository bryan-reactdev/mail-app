import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Layout from "./Layout";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  const notFoundContent = (
    <Effect className="w-full max-w-md" slide fade delay={50}>
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="size-12" />
          </EmptyMedia>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button variant="default" onClick={() => navigate(-1)} className="flex-1">
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
          </div>
        </EmptyContent>
      </Empty>
    </Effect>
  );

  if (isAppRoute) {
    return (
      <Layout>
        <div className="w-full h-full flex items-center justify-center">
          {notFoundContent}
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      {notFoundContent}
    </div>
  );
}

