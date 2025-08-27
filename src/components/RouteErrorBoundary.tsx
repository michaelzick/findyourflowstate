import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName?: string;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children,
  routeName = 'page'
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRouteError = (error: Error) => {
    console.error(`Error in ${routeName}:`, error);

    // Show toast notification for route errors
    toast({
      title: "Page Error",
      description: `An error occurred while loading the ${routeName}. Please try again.`,
      variant: "destructive",
    });
  };

  const RouteErrorFallback = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Page Error</CardTitle>
          <CardDescription>
            We couldn't load the {routeName} properly. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload Page
            </Button>

            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={<RouteErrorFallback />}
      onError={handleRouteError}
      showReloadButton={false}
      showHomeButton={false}
    >
      {children}
    </ErrorBoundary>
  );
};
