import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizResultsModalsProps {
  // No Previous Results Modal
  showNoResultsModal: boolean;
  onCloseNoResultsModal: () => void;

  // Reset Confirmation Modal
  showResetModal: boolean;
  onCloseResetModal: () => void;
  onConfirmReset: () => void;
}

export function QuizResultsModals({
  showNoResultsModal,
  onCloseNoResultsModal,
  showResetModal,
  onCloseResetModal,
  onConfirmReset,
}: QuizResultsModalsProps) {
  return (
    <>
      {/* No Previous Results Modal */}
      <AlertDialog open={showNoResultsModal} onOpenChange={onCloseNoResultsModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Previous Results Found</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't taken the quiz yet or your previous results are no longer available.
              Take the quiz to see your personalized career insights.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onCloseNoResultsModal}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation Modal - Reusing existing pattern */}
      <AlertDialog open={showResetModal} onOpenChange={onCloseResetModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your current answers and results. You'll start from the beginning. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmReset}
              className="bg-destructive hover:bg-destructive/90"
            >
              Start New Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
