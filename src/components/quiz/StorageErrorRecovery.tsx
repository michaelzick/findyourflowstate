import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Trash2, Info } from 'lucide-react';
import { QuizResultsStorageError, StorageError } from '@/utils/quiz-results-storage';

interface StorageErrorRecoveryProps {
  error: QuizResultsStorageError;
  onRecover: () => void;
  onDismiss: () => void;
  isRecovering?: boolean;
}

export const StorageErrorRecovery: React.FC<StorageErrorRecoveryProps> = ({
  error,
  onRecover,
  onDismiss,
  isRecovering = false
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case StorageError.QUOTA_EXCEEDED:
        return <Trash2 className="h-5 w-5 text-warning" />;
      case StorageError.UNAVAILABLE:
      case StorageError.PERMISSION_DENIED:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRecoveryActions = () => {
    switch (error.type) {
      case StorageError.CORRUPTED_DATA:
      case StorageError.PARSE_ERROR:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              We can try to repair your storage by clearing corrupted data.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={onRecover}
                disabled={isRecovering}
                size="sm"
              >
                {isRecovering ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Repairing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Repair Storage
                  </>
                )}
              </Button>
              <Button onClick={onDismiss} variant="outline" size="sm">
                Dismiss
              </Button>
            </div>
          </div>
        );

      case StorageError.QUOTA_EXCEEDED:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your browser storage is full. We can try to clear old quiz data to make space.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={onRecover}
                disabled={isRecovering}
                size="sm"
              >
                {isRecovering ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Storage
                  </>
                )}
              </Button>
              <Button onClick={onDismiss} variant="outline" size="sm">
                Dismiss
              </Button>
            </div>
          </div>
        );

      case StorageError.UNAVAILABLE:
      case StorageError.PERMISSION_DENIED:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your browser settings and enable local storage for this site.
            </p>
            <Button onClick={onDismiss} variant="outline" size="sm">
              Dismiss
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You can try refreshing the page or clearing your browser data.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.reload()}
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              <Button onClick={onDismiss} variant="outline" size="sm">
                Dismiss
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="border-warning/50 bg-warning/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {getErrorIcon()}
          <CardTitle className="text-base">Storage Issue Detected</CardTitle>
        </div>
        <CardDescription>
          {error.getUserFriendlyMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {getRecoveryActions()}

        {/* Show technical details in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Technical Details (Development)
            </summary>
            <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
              <p><strong>Error Type:</strong> {error.type}</p>
              <p><strong>Message:</strong> {error.message}</p>
              {error.originalError && (
                <p><strong>Original Error:</strong> {error.originalError.message}</p>
              )}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};
