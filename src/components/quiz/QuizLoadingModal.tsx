import * as React from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Brain, Sparkles, Target } from 'lucide-react';
import { cn } from "@/lib/utils";

interface QuizLoadingModalProps {
  isOpen: boolean;
}

export function QuizLoadingModal({ isOpen }: QuizLoadingModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    { icon: Target, text: "Analyzing your responses..." },
    { icon: Brain, text: "Processing personality patterns..." },
    { icon: Sparkles, text: "Generating personalized insights..." },
  ];

  React.useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  const CurrentIcon = steps[currentStep]?.icon || Target;

  return (
    <DialogPrimitive.Root open={isOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Processing Quiz Results
          </DialogPrimitive.Title>

          <div className="flex flex-col items-center space-y-6 py-4">
            {/* Animated Spinner */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CurrentIcon className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/20 animate-spin border-t-primary"></div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Processing Your Results</h3>
              <p className="text-muted-foreground">
                {steps[currentStep]?.text || "Analyzing your responses..."}
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a few moments while we analyze your responses with AI
              </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
