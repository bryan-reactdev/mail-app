import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Layout from "./Layout";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
        <Effect className="w-full h-full flex flex-col items-center justify-center" slide fade delay={50}>
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
                <Button variant="default" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>
                </EmptyContent>
            </Empty>
        </Effect>
    </Layout>
  );
}

